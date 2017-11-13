package com.gu.acquisition.model

import io.circe.{Decoder, Encoder}
import io.circe.generic.semiauto._
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.event.{AbTest, AcquisitionSource}
import play.api.libs.json.{Reads, Writes, Json => PlayJson}

/**
  * Model for acquisition data passed by the referrer.
  */
case class ReferrerAcquisitionData(
    campaignCode: Option[String],
    referrerPageviewId: Option[String],
    referrerUrl: Option[String],
    componentId: Option[String],
    componentType: Option[ComponentType],
    source: Option[AcquisitionSource],
    abTest: Option[AbTest], //Deprecated, please use abTests
    abTests: Option[Seq[AbTest]]
)

object ReferrerAcquisitionData {
  // Ignore IntelliJ - these imports are used!
  import com.gu.acquisition.instances.abTest._
  import com.gu.acquisition.instances.acquisitionSource._
  import com.gu.acquisition.instances.componentType._

  implicit val referrerAcquisitionDataDecoder: Decoder[ReferrerAcquisitionData] = deriveDecoder[ReferrerAcquisitionData]

  implicit val referrerAcquisitionDataEncoder: Encoder[ReferrerAcquisitionData] = deriveEncoder[ReferrerAcquisitionData]

  implicit val referrerAcquisitionDataReads: Reads[ReferrerAcquisitionData] = PlayJson.reads[ReferrerAcquisitionData]

  implicit val referrerAcquisitionDataWrites: Writes[ReferrerAcquisitionData] = PlayJson.writes[ReferrerAcquisitionData]
}