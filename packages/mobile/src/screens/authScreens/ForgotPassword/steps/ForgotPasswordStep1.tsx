import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {useForgotPasswordMutation} from "../../../../generated/graphql";
import Snackbar from "react-native-snackbar";
import {useFormik} from "formik";
import {OutlinedTextInput as InputText} from "../../../../components/inputs";
import {ForgotPasswordForm1ValidationSchema} from "../../../../utils/validation";
import {Colors} from "../../../../styles";
import {SubmitButton} from "../../../../components/buttons";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

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
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <View style={{flex: 1}}>
          <Text style={styles.text}>
            Ti manderemo per email un codice con il quale potrai modificare la
            password del tuo account. Inserisci pefavore nella casella
            sottostante l'email utilizzata in fase di registrazione.
          </Text>
          <View style={{marginTop: 40}}>
            <InputText
              label="Email"
              email
              onChangeText={formik.handleChange("email") as any}
              onBlur={formik.handleBlur("email") as any}
              value={formik.values.email}
              errorMessage={formik.errors.email}
            />
          </View>
        </View>

        <SubmitButton
          title="Invia l'email"
          containerStyle={{marginBottom: 30}}
          onPress={formik.handleSubmit as any}
          isLoading={formik.isSubmitting}
          disabled={!formik.isValid}
        />
      </KeyboardAwareScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#404040",
    fontSize: 18,
  },
});
