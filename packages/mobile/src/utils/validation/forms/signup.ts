import * as Yup from "yup";
import {isEmpty} from "lodash";
import {client} from "../../../graphql";
import {
  IsEmailAlreadyUsedDocument,
  IsUsernameAlreadyUsedDocument,
} from "../../../generated/graphql";
import {validationConfig} from "@footprint/config";

/**
 * Schema di validazione del form di registrazione
 */
export const SignupValidationSchema = Yup.object().shape({
  // GOOGLE ACCESS TOKEN
  googleAccessToken: Yup.string(),
  // EMAIL
  email: Yup.string()
    .email("Email non valida")
    .max(validationConfig.user.email.length.max, "L'email è troppo lunga")
    // Il campo è richiesto solo quando la registrazione non avviene con google
    .when("googleAccessToken", {
      is: (val) => isEmpty(val),
      then: Yup.string().required("Questo campo è richiesto"),
    })
    // Controlla che l'email non sia già utilizzata
    .test("unique-email", "L'email è già utilizzata", function (email: string) {
      if (!!email)
        return client
          .query({
            query: IsEmailAlreadyUsedDocument,
            variables: {email},
          })
          .then((res) => !(res.data && res.data.isEmailAlreadyUsed === true))
          .catch(() => false);
      else return true;
    }),
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
    // Il campo è richiesto solo quando la registrazione non avviene con google
    .when("googleAccessToken", {
      is: (val) => isEmpty(val),
      then: Yup.string().required("Questo campo è richiesto"),
    }),
  // CONFERMA DELLA PASSWORD
  password2: Yup.string()
    .oneOf([Yup.ref("password")], "Le password non corrispondono")
    // Il campo è richiesto solo quando la registrazione non avviene con google
    .when("googleAccessToken", {
      is: (val) => isEmpty(val),
      then: Yup.string().required("Questo campo è richiesto"),
    }),
  // USERNAME
  username: Yup.string()
    .min(validationConfig.user.username.length.min, "L'username è troppo corto")
    .max(validationConfig.user.username.length.max, "L'username è troppo lungo")
    .matches(validationConfig.user.username.regex, "Formarto non consentito")
    .required("Questo campo è richiesto")
    // Controlla che non sia già utilizzato
    .test("unique-username", "L'username non è disponibile", function (
      username: string,
    ) {
      if (!!username)
        return client
          .query({
            query: IsUsernameAlreadyUsedDocument,
            variables: {username},
          })
          .then((res) => !(res.data && res.data.isUsernameAlreadyUsed === true))
          .catch(() => false);
      else return true;
    }),
  // IMMAGINE PROFILO CARICATA
  profileImage: Yup.object(),
  // URL DELL'IMMAGINE DEL PROFILO SOCIAL COLLEGATO ALL'ACCOUNT
  socialPictureUrl: Yup.string(),
  // LOCATION
  location: Yup.object().nullable().required("É richiesta la posizione"),
});
