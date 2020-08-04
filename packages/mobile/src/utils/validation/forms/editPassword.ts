import * as Yup from "yup";
import {isEmpty} from "lodash";
import {ValidationConfig} from "@footprint/common";

/**
 * Schema di validazione del form per cambiare password
 */
export const EditPasswordValidationSchema = Yup.object().shape({
  // PASSWORD
  password: Yup.string()
    .min(
      ValidationConfig.user.password.length.min,
      "La password è troppo corta",
    )
    .max(
      ValidationConfig.user.password.length.max,
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
