import * as Yup from "yup";
import {validationConfig} from "@footprint/config";

/**
 * Schema di validazione del form di login
 */
export const SignInValidationSchema = Yup.object().shape({
  // EMAIL
  email: Yup.string()
    .email("Email non valida")
    .max(validationConfig.user.email.length.max, "L'email è troppo lunga")
    .required("Questo campo è richiesto"),
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
});
