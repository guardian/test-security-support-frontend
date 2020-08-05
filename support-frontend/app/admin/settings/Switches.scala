package admin.settings

import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec.deriveCodec

case class Switches(
  oneOffPaymentMethods: PaymentMethodsSwitch,
  recurringPaymentMethods: PaymentMethodsSwitch,
  useDotcomContactPage: Option[SwitchState],
  enableRecaptchaBackend: SwitchState,
  enableRecaptchaFrontend: SwitchState,
  experiments: Map[String, ExperimentSwitch],
  ccpaEnabled: SwitchState
)

object Switches {
  implicit val switchesCodec: Codec[Switches] = deriveCodec
}
