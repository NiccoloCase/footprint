import React from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParamList} from "../../../navigation";
import {CodeInput} from "../../../components/inputs";
import {
  useVerfyUserMutation,
  useSendConfirmationEmailMutation,
} from "../../../generated/graphql";
import {store} from "../../../store";
import Snackbar from "react-native-snackbar";
import {useEmailTimer} from "../../../utils/useEmailTimer";

/** Propietà della scheramata di registrazione */
type VerifyEmailScreenProps = StackScreenProps<
  AuthStackParamList,
  "VerifyEmail"
>;

export const VerifyEmail: React.FC<VerifyEmailScreenProps> = ({route}) => {
  const {email} = route.params;

  // GRAPHQL
  const [verfyUser] = useVerfyUserMutation();
  const [
    sendConfirmationEmail,
    {loading: sendEmailLoading, data: sendEmailData},
  ] = useSendConfirmationEmailMutation();

  const [startTimer, {canEmailBeSent, timeLeft}] = useEmailTimer();

  const sendEmail = async () => {
    try {
      const {data, errors} = await sendConfirmationEmail({variables: {email}});

      if (errors || (data && !data.sendConfirmationEmail.success)) {
        Snackbar.show({
          text: "Non è possibile inviare l'email. Riprova più tardi",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "#FF596E",
        });
      }
    } catch (err) {
      Snackbar.show({
        text: "Non è possibile inviare l'email. Riprova più tardi",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "#FF596E",
      });
    } finally {
      startTimer();
    }
  };

  const handleSubmit = async (
    token: string,
  ): Promise<{errorMessage?: string}> => {
    try {
      const {data, errors} = await verfyUser({variables: {token}});

      if (!errors && data && data.verfyUser.success && data.verfyUser.tokens) {
        // esegue l'accesso dell'utente
        const {accessToken, refreshToken} = data.verfyUser.tokens;
        store.getActions().auth.singin({accessToken, refreshToken});

        return {errorMessage: ""};
      } else if (errors) {
        return {errorMessage: "Si è verificato un errore. Riprova più tardi."};
      } else
        return {
          errorMessage:
            "Il codice non è valido: potrebbe essere scaduto o già utilizzato",
        };
    } catch (err) {
      return {errorMessage: "Si è verificato un errore. Riprova più tardi."};
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.title}>Abbiamo quasi finito!</Text>
      <Text style={styles.text}>
        Devi solo confermare l'email inserita in fase di registrazione.
      </Text>
      <Text style={styles.text}>
        Inserisci perfavore il codice che è stato inviato all'email{" "}
        <Text style={styles.email}> {email}</Text> nella casella sottostante
      </Text>

      <View style={{flexDirection: "row"}}>
        <TouchableOpacity
          onPress={sendEmail}
          style={[
            styles.sendButton,
            {opacity: canEmailBeSent && !sendEmailLoading ? 1 : 0.7},
          ]}
          disabled={!canEmailBeSent}>
          <Text style={styles.sendButtonText}>
            {canEmailBeSent
              ? sendEmailData
                ? "Rinvia"
                : "Email non arrivata?"
              : `Rinvia tra ${timeLeft}`}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputCodeWrapper}>
        <Text style={styles.inputCodeTitle}>Inserisci il codice:</Text>
        <CodeInput onFill={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
    paddingTop: 30,
  },
  text: {
    color: "#404040",
    fontSize: 18,
  },
  title: {
    marginBottom: 20,
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    color: "#FF596E",
    fontStyle: "italic",
  },
  sendButton: {
    backgroundColor: "#FF596E",
    padding: 10,
    borderRadius: 4,
    marginTop: 15,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputCodeWrapper: {
    backgroundColor: "#f5f5f5",
    marginTop: 50,
    paddingTop: 30,
    paddingBottom: 60,
    borderRadius: 7,
  },
  inputCodeTitle: {
    fontWeight: "bold",
    color: "#FF596E",
    textAlign: "center",
    fontSize: 18,
  },
});

/**
 * 
 *       <View style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Verify</Text>
      </View>

  nextButton: {
    marginTop: 30,
    borderRadius: 60,
    height: 60,
    backgroundColor: "#3557b7",
    justifyContent: "center",
    minWidth: 300,
    marginBottom: 100,
  },
  nextButtonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    fontWeight: "700",
  },
 * 
 * 
 * 
 */
