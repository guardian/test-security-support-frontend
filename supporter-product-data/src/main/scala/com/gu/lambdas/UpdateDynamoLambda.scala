package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.lambdas.UpdateDynamoLambda.writeToDynamo
import com.gu.model.Stage
import com.gu.model.dynamo.SupporterRatePlanItem
import com.gu.model.states.UpdateDynamoState
import com.gu.services.{AlarmService, DynamoDBService, ConfigService, S3Service}
import com.typesafe.scalalogging.StrictLogging
import kantan.csv._
import kantan.csv.ops._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.DurationInt
import scala.concurrent.{Await, Future}

trait TimeOutCheck {
  def timeRemainingMillis: Int
}

class ContextTimeOutCheck(context: Context) extends TimeOutCheck {
  override def timeRemainingMillis = context.getRemainingTimeInMillis
}

class UpdateDynamoLambda extends Handler[UpdateDynamoState, UpdateDynamoState] {
  override protected def handlerFuture(input: UpdateDynamoState, context: Context) = {
    writeToDynamo(Stage.fromEnvironment, input, new ContextTimeOutCheck(context))
  }
}

object UpdateDynamoLambda extends StrictLogging {
  val batchSize = 10
  val timeoutBufferInMillis = batchSize * 5 * 1000

  def writeToDynamo(stage: Stage, state: UpdateDynamoState, timeOutCheck: TimeOutCheck): Future[UpdateDynamoState] = {
    logger.info(s"Starting write to dynamo task for ${state.recordCount} records from ${state.filename}")

    val csvStream = S3Service.streamFromS3(stage, state.filename)
    val csvReader = csvStream.asCsvReader[SupporterRatePlanItem](rfc.withHeader)
    val dynamoDBService = DynamoDBService(stage)
    val alarmService = AlarmService(stage)

    val unProcessed = getUnprocessedItems(csvReader, state.processedCount)

    val validUnprocessed = unProcessed.collect { case (Right(item), index) => (item, index) }
    val invalidUnprocessedIndexes = unProcessed.collect { case (Left(_), index) => index }

    if (invalidUnprocessedIndexes.nonEmpty && state.processedCount == 0) {
      logger.error(
        s"There were ${invalidUnprocessedIndexes.length} CSV read failures from file ${state.filename} with line numbers ${invalidUnprocessedIndexes.mkString(",")}"
      )
      alarmService.triggerCsvReadAlarm
    }

    val batches = validUnprocessed.grouped(batchSize)

    val processedCount = writeBatchesUntilTimeout(
      state.processedCount,
      batches,
      timeOutCheck,
      dynamoDBService,
      alarmService
    )


    val maybeSaveSuccessTime = if (processedCount == state.recordCount)
        ConfigService(stage).putLastSuccessfulQueryTime(state.attemptedQueryTime)
      else Future.successful(())

    maybeSaveSuccessTime.map(_ => state.copy(processedCount = processedCount))
  }

  def getUnprocessedItems(csvReader: CsvReader[ReadResult[SupporterRatePlanItem]], processedCount: Int) =
    csvReader.zipWithIndex.drop(processedCount).toList

  def writeBatchesUntilTimeout(
    processedCount: Int,
    groups: Iterator[List[(SupporterRatePlanItem, Int)]],
    timeOutCheck: TimeOutCheck,
    dynamoDBService: DynamoDBService,
    alarmService: AlarmService
  ): Int =
    groups.foldLeft(processedCount) {
      (processedCount, group) =>
        if (timeOutCheck.timeRemainingMillis < timeoutBufferInMillis) {
          logger.info(
            s"Aborting processing - time remaining: ${timeOutCheck.timeRemainingMillis / 1000} seconds, buffer: ${timeoutBufferInMillis / 1000} seconds"
          )
          return processedCount
        }
        logger.info(
          s"Continuing processing - time remaining: ${timeOutCheck.timeRemainingMillis / 1000} seconds, buffer: ${timeoutBufferInMillis / 1000} seconds"
        )

        Await.result(writeBatch(group, dynamoDBService, alarmService), 120.seconds)

        val (_, highestProcessedIndex) = group.last
        val newProcessedCount = highestProcessedIndex + 1
        logger.info(s"$newProcessedCount items processed")
        newProcessedCount
    }

  def writeBatch(list: List[(SupporterRatePlanItem, Int)], dynamoDBService: DynamoDBService, alarmService: AlarmService) = {
    val futures = list.map {
      case (supporterRatePlanItem, index) =>
        logger.info(
          s"Attempting to write item index $index - ${supporterRatePlanItem.productRatePlanName} " +
            s"rate plan with term end date ${supporterRatePlanItem.termEndDate} to Dynamo")
        dynamoDBService
          .writeItem(supporterRatePlanItem)
          .recover {
            // let's alarm and keep going if one insert fails
            case error: Throwable =>
              logger.error(s"An error occurred trying to write item $supporterRatePlanItem, at index $index", error)
              alarmService.triggerDynamoWriteAlarm
          }

    }
    Future.sequence(futures)
  }
}
