import * as Yup from "yup";
import {client} from "../../../graphql";
import {IsEmailAlreadyUsedDocument} from "../../../generated/graphql";
import {validationConfig} from "@footprint/config";

/**
 * Schema di validazione del primo form del recupero della password
 */
export const ForgotPasswordForm1ValidationSchema = Yup.object().shape({
  // EMAIL
  email: Yup.string()
    .email("Email non valida")
    .max(validationConfig.user.email.length.max, "L'email è troppo lunga")
    .required("Questo campo è richiesto")
    // Controlla che l'email non sia già utilizzata
    .test("unique-email", "L'email non è associata a nessun account", function (
      email: string,
    ) {
      if (!!email)
        return client
          .query({
            query: IsEmailAlreadyUsedDocument,
            variables: {email},
          })
          .then((res) => res.data && res.data.isEmailAlreadyUsed)
          .catch(() => false);
      else return true;
    }),
});

/**
 * Schema di validazione del secondo form del recupero della password
 */
export const ForgotPasswordForm2ValidationSchema = Yup.object().shape({
  // NUOVA PASSWORD
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

  // CONFERMA DELLA PASSWORD
  password2: Yup.string()
    .oneOf([Yup.ref("password")], "Le password non corrispondono")
    .required("Questo campo è richiesto"),

  // TOKEN
  token: Yup.string().required("È richiesto il codice"),
});
