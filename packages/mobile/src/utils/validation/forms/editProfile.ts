import * as Yup from "yup";
import {isEmpty} from "lodash";
import {client} from "../../../graphql";
import {
  IsEmailAlreadyUsedDocument,
  IsUsernameAlreadyUsedDocument,
} from "../../../generated/graphql";
import {validationConfig} from "@footprint/config";
/**
 * Schema di validazione del form per modifcare il profilo
 */
export const EditProfileFormValidationSchema = Yup.object().shape({
  // EMAIL
  email: Yup.string()
    .email("Email non valida")
    .max(validationConfig.user.email.length.max, "L'email è troppo lunga")
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
  // USERNAME
  username: Yup.string()
    .min(validationConfig.user.username.length.min, "L'username è troppo corto")
    .max(validationConfig.user.username.length.max, "L'username è troppo lungo")
    .matches(validationConfig.user.username.regex, "Formarto non consentito")
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
});
