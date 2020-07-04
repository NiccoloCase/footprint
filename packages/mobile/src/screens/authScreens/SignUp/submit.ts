import {SingUpFormValues} from ".";
import {
  useRegisterMutation,
  useSignupWithGoogleMutation,
  RegisterMutationResult,
  SignupWithGoogleMutationResult,
} from "../../../generated/graphql";
import Snackbar from "react-native-snackbar";
import {NavigationProp, CommonActions} from "@react-navigation/native";
import {AuthStackParamList} from "../../../navigation";
import {store} from "../../../store";

export function useSubmitSignUp(
  withGoogle: boolean,
  navigation: NavigationProp<AuthStackParamList, "SignUp">,
): [
  (values: SingUpFormValues) => Promise<void>,
  RegisterMutationResult | SignupWithGoogleMutationResult,
] {
  // GRAPHQL
  const [signupLocally, localPayload] = useRegisterMutation();
  const [signupGoogle, googlePayload] = useSignupWithGoogleMutation({
    errorPolicy: "all",
  });

  const submit = async (values: SingUpFormValues) => {
    const {username, email, password, googleAccessToken} = values;

    try {
      if (withGoogle) {
        const {errors, data} = await signupGoogle({
          variables: {username},
          context: {
            headers: {access_token: googleAccessToken},
          },
        });
        // Se l'operazione ha avuto successo esegue l'accesso dell'utente
        // con i token passati dal server
        if (
          !errors &&
          data &&
          !data.signupWithGoogle.isRegistrationRequired &&
          data.signupWithGoogle.tokens
        ) {
          const {accessToken, refreshToken} = data.signupWithGoogle.tokens;
          store.getActions().auth.singin({accessToken, refreshToken});
        }
      } else {
        await signupLocally({variables: {username, email, password}});
        // Reindirizza l'utente alla schermata per confermare l'email
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: "VerifyEmail",
                params: {username, email},
              },
            ],
          }),
        );
      }
    } catch (err) {
      Snackbar.show({
        text: "Ops...semba che ci sia stato un errore ",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "#FF596E",
      });
    }
  };

  const result = withGoogle ? googlePayload : localPayload;

  return [submit, result];
}
