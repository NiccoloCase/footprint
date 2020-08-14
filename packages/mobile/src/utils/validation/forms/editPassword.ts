import * as Yup from "yup";
import {isEmpty} from "lodash";
import {validationConfig} from "@footprint/config";

/**
 * Schema di validazione del form per cambiare password
 */
export const EditPasswordValidationSchema = Yup.object().shape({
  // PASSWORD
  password: Yup.string()
    .min(
      validationConfig.user.password.length.min,
      "La password è troppo corta",
    )
    .max(
      validationConfig.user.password.length.max,
      "La password è troppo lunga",
    )
    .required("Questo campo è richiesto"),
  // NUOVA PASSWORD
  newPassword: Yup.string()
    .notOneOf(
      [Yup.ref("password")],
      "La nuova password deve essere diversa da quella vecchia",
    )
    .required("Questo campo è richiesto"),
  // CONFERMA DELLA NUOVA PASSWORD
  newPassword2: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Le password non corrispondono")
    .required("Questo campo è richiesto"),
});
