import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {useForgotPasswordMutation} from "../../../../generated/graphql";
import Snackbar from "react-native-snackbar";
import {useFormik} from "formik";
import {InputText} from "../../../../components/InputText";
import {ForgotPasswordForm1ValidationSchema} from "../../../../utils/validation";
import {Colors} from "../../../../styles";

interface ForgotPasswordStep1Props {
  nextPage: (email: string) => void;
}

interface ForgotPasswordStep1Values {
  email: string;
}

export const ForgotPasswordStep1: React.FC<ForgotPasswordStep1Props> = ({
  nextPage,
}) => {
  // FORM
  const formik = useFormik<ForgotPasswordStep1Values>({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordForm1ValidationSchema,
    onSubmit,
  });
  // GRAPHQL
  const [forgotPassword] = useForgotPasswordMutation();

  async function onSubmit({email}: ForgotPasswordStep1Values) {
    try {
      const {data, errors} = await forgotPassword({variables: {email}});
      if (errors || (data && !data.forgotPassword.success)) throw new Error();
      else nextPage(data?.forgotPassword.recipient!);
    } catch (err) {
      if (
        err.graphQLErrors &&
        err.graphQLErrors[0].extensions &&
        err.graphQLErrors[0].extensions.exception &&
        err.graphQLErrors[0].extensions.exception.response &&
        typeof err.graphQLErrors[0].extensions.exception.response.message ===
          "string"
      ) {
        const msg: string = err.graphQLErrors[0].extensions.exception.response.message.toLowerCase();
        if (msg.includes("user"))
          formik.setFieldError("email", "L'utente non esiste");
        else
          Snackbar.show({
            text: "Non è possibile inviare l'email. Riprova più tardi",
            duration: Snackbar.LENGTH_LONG,
            backgroundColor: Colors.primary,
          });
      }
    }
  }

  return (
    <ScrollView contentContainerStyle={{flex: 1}}>
      <Text style={styles.title}>Hai perso la password?</Text>
      <Text style={styles.subtitle}>Nessun probelma!</Text>
      <View style={{flex: 1}}>
        <Text style={styles.text}>
          Ti manderemo per email un codice con il quale potrai modificare la
          password del tuo account. Inserisci pefavore nella casella sottostante
          l'email utilizzata in fase di registrazione.
        </Text>
        <View style={{marginTop: 40}}>
          <InputText
            label="Email"
            onChangeText={formik.handleChange("email") as any}
            onBlur={formik.handleBlur("email") as any}
            value={formik.values.email}
            errorMessage={
              formik.touched.email ? formik.errors.email : undefined
            }
            keyboardType="email-address"
          />
        </View>
      </View>
      <View style={{flexDirection: "row"}}>
        <TouchableOpacity
          onPress={formik.handleSubmit as any}
          style={[
            styles.sendButton,
            {opacity: !formik.isValid || formik.isSubmitting ? 0.6 : 1},
          ]}
          disabled={!formik.isValid || formik.isSubmitting}>
          <Text style={[styles.text, styles.sendButtonText]}>
            Invia l'email
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#404040",
    fontSize: 18,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#404040",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#A9ADB2",
  },
  sendButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 4,
    marginTop: 15,
    marginBottom: 30,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
});
