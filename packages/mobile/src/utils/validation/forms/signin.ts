import * as Yup from "yup";

/**
 * Schema di validazione del form di login
 */
export const SignInValidationSchema = Yup.object().shape({
  // EMAIL
  email: Yup.string()
    .email("Email non valida")
    .required("Questo campo è richiesto"),
  // PASSWORD
  password: Yup.string()
    .min(2, "La password è troppo corta")
    .max(30, "La password è troppo lunga")
    .required("Questo campo è richiesto"),
});
