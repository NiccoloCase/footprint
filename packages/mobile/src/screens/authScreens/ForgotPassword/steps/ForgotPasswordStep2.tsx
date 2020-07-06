import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {CodeInput} from "../../../../components/inputs";
import {useEmailTimer} from "../../../../utils/useEmailTimer";
import {
  useForgotPasswordMutation,
  useChangePasswordWithTokenMutation,
} from "../../../../generated/graphql";
import Snackbar from "react-native-snackbar";
import {useFormik} from "formik";
import {InputText} from "../../../../components/InputText";
import {ForgotPasswordForm2ValidationSchema} from "../../../../utils/validation";
import {useNavigation} from "@react-navigation/native";

interface ForgotPasswordStep2Props {
  email: string;
  prevPage: () => void;
}
interface ForgotPasswordStep2Values {
  password: string;
  password2: string;
  token: string;
}

export const ForgotPasswordStep2: React.FC<ForgotPasswordStep2Props> = ({
  email,
  prevPage,
}) => {
  const navigation = useNavigation();
  const [startTimer, {canEmailBeSent, timeLeft}] = useEmailTimer();
  // FORM
  const formik = useFormik<ForgotPasswordStep2Values>({
    initialValues: {
      password: "",
      password2: "",
      token: "",
    },
    onSubmit,
    validationSchema: ForgotPasswordForm2ValidationSchema,
  });
  // GRAPHQL
  const [
    forgotPassword,
    {loading: sendEmailLoading, data: sendEmailData},
  ] = useForgotPasswordMutation();
  const [changePassword] = useChangePasswordWithTokenMutation();

  async function onSubmit(values: ForgotPasswordStep2Values): Promise<void> {
    const {password, token} = values;

    try {
      const {data, errors} = await changePassword({
        variables: {
          token,
          newPassword: password,
        },
      });

      if (errors || !data) throw new Error();

      if (data.changePasswordWithToken.success) {
        // renderizza l'utente alla schermata di login
        navigation.navigate("SignIn");
      } else {
        // token sbagliato
        formik.setFieldError(
          "token",
          "Il codice non è valido: potrebbe essere scaduto o già utilizzato",
        );
      }
    } catch (err) {
      Snackbar.show({
        text: "Si è verificato un errore. Riprova più tardi",
        duration: Snackbar.LENGTH_LONG,
        backgroundColor: "#FF596E",
      });
    }
  }

  const sendEmail = async () => {
    try {
      const {data, errors} = await forgotPassword({variables: {email}});
      // in caso di errore:
      if (errors || (data && !data.forgotPassword.success)) throw new Error();
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

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <View style={{flex: 1}}>
        <Text style={styles.title}>Abbiamo quasi finito!</Text>
        <InputText
          label="Nuova password"
          onChangeText={formik.handleChange("password") as any}
          onBlur={formik.handleBlur("password") as any}
          value={formik.values.password}
          errorMessage={
            formik.touched.password ? formik.errors.password : undefined
          }
          secureTextEntry
        />
        <InputText
          label="Conferma la password"
          onChangeText={formik.handleChange("password2") as any}
          onBlur={formik.handleBlur("password2") as any}
          value={formik.values.password2}
          errorMessage={
            formik.touched.password2 ? formik.errors.password2 : undefined
          }
          secureTextEntry
        />
        <Text style={[styles.text, {marginTop: 20, marginBottom: 10}]}>
          Inserisci perfavore il codice che è stato inviato all'email{" "}
          <Text style={styles.email}>{email}</Text> nella casella sottostante
        </Text>
        <View style={{flexDirection: "row"}}>
          <TouchableOpacity
            onPress={sendEmail}
            style={[
              styles.button,
              styles.outlineButton,
              {
                marginRight: 10,
                opacity: canEmailBeSent && !sendEmailLoading ? 1 : 0.7,
              },
            ]}
            disabled={!canEmailBeSent}>
            <Text style={[styles.text, styles.linkText]}>
              {canEmailBeSent
                ? sendEmailData
                  ? "Rinvia email"
                  : "Email non arrivata?"
                : `Rinvia tra ${timeLeft}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => prevPage()}
            style={[
              styles.button,
              {marginLeft: 10, backgroundColor: "transparent"},
            ]}>
            <Text style={[styles.text, styles.linkText]}>Cambia email</Text>
          </TouchableOpacity>
        </View>
        <CodeInput
          onCodeChange={formik.handleChange("token") as any}
          errorMessage={formik.touched.token ? formik.errors.token : undefined}
        />
      </View>
      <View>
        <TouchableOpacity
          onPress={formik.handleSubmit as any}
          style={[
            styles.button,
            styles.submitButton,
            {opacity: !formik.isValid || formik.isSubmitting ? 0.6 : 1},
          ]}
          disabled={!formik.isValid || formik.isSubmitting}>
          {formik.isSubmitting ? (
            <ActivityIndicator color="#fff" size={24} />
          ) : (
            <Text style={[styles.text, styles.buttonText]}>
              Cambia password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#404040",
  },
  text: {
    color: "#404040",
    fontSize: 18,
  },
  email: {
    color: "#FF596E",
    fontStyle: "italic",
  },
  button: {
    flex: 1,
    backgroundColor: "#FF596E",
    padding: 10,
    borderRadius: 4,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  linkText: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#FF596E",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  outlineButton: {
    borderColor: "#FF596E",
    borderWidth: 2,
    backgroundColor: "transparent",
  },
  underlinedButton: {
    borderBottomColor: "#FF596E",
    borderBottomWidth: 2,
    backgroundColor: "transparent",
  },
  submitButton: {
    padding: 16,
  },
});
