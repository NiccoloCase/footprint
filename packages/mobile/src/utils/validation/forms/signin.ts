import * as Yup from "yup";
import {ValidationConfig} from "@footprint/common";

/**
 * Schema di validazione del form di login
 */
export const SignInValidationSchema = Yup.object().shape({
  // EMAIL
  email: Yup.string()
    .email("Email non valida")
    .max(ValidationConfig.user.email.length.max, "L'email è troppo lunga")
    .required("Questo campo è richiesto"),
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
});
