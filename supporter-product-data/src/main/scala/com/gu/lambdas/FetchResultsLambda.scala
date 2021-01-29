package com.gu.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.conf.ZuoraQuerierConfig
import com.gu.lambdas.FetchResultsLambda.fetchResults
import com.gu.model.Stage
import com.gu.model.states.{FetchResultsState, UpdateDynamoState}
import com.gu.model.zuora.response.JobStatus.Completed
import com.gu.monitoring.SafeLogger
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.services.{S3Service, SelectActiveRatePlansQuery, ZuoraQuerierService}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration.DurationInt

class FetchResultsLambda extends Handler[FetchResultsState, UpdateDynamoState] {
  override protected def handlerFuture(input: FetchResultsState, context: Context) =
    fetchResults(Stage.fromEnvironment, input.jobId)
}

object FetchResultsLambda {
  def fetchResults(stage: Stage, jobId: String) = {
    SafeLogger.info(s"Attempting to fetch results for jobId $jobId")
    for {
      config <- ZuoraQuerierConfig.load(stage)
      service = new ZuoraQuerierService(config, configurableFutureRunner(60.seconds))
      result <- service.getResults(jobId)
      _ = assert(result.status == Completed, s"Job with id $jobId is still in status ${result.status}")
      batch = result.batches.headOption.toRight(s"No batches were returned in the batch query response for jobId $jobId").right.get
      fileId = batch.fileId.toRight(s"Batch.fileId was missing in jobId $jobId").right.get
      filename = s"${batch.name}-$fileId.csv"
      fileResponse <- service.getResultFileResponse(fileId)
      _ = assert(fileResponse.isSuccessful, s"File download for job with id $jobId failed with http code ${fileResponse.code}")
      _ <- S3Service.streamToS3(stage, filename, fileResponse.body.byteStream, fileResponse.body.contentLength)
    } yield {
      SafeLogger.info(s"Successfully wrote file $filename to S3 with ${batch.recordCount} records for jobId $jobId")
      UpdateDynamoState(
        filename,
        batch.recordCount,
        processedCount = 0
      )
    }
  }
}
