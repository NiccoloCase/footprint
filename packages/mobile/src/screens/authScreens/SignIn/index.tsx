import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import {useFormik} from "formik";
import {StackScreenProps} from "@react-navigation/stack";
import {useLoginMutation} from "../../../generated/graphql";
import {AuthStackParamList} from "../../../navigation";
import {InputText} from "../../../components/InputText";
import {GoogleSigninButton} from "../../../components/GoogleSigninButton";
import {store} from "../../../store";
import {SignInValidationSchema} from "../../../utils/validation";
import Snackbar from "react-native-snackbar";
import {Spinner} from "../../../components/Spinner";

interface SingInFormValues {
  email: string;
  password: string;
}

type SignInScreenProps = StackScreenProps<AuthStackParamList, "SignIn">;

export const SignInScreen: React.FC<SignInScreenProps> = ({navigation}) => {
  // FORM
  const formik = useFormik<SingInFormValues>({
    initialValues: {email: "", password: ""},
    onSubmit,
    validationSchema: SignInValidationSchema,
    validateOnBlur: false,
    validateOnChange: false,
  });
  // GRAPHQL
  const [login] = useLoginMutation();

  /**
   * Esegue il login locale (con email e password)
   */
  async function onSubmit() {
    const {email, password} = formik.values;
    try {
      const {data} = await login({variables: {email, password}});
      if (data) {
        const {accessToken, refreshToken} = data.login;
        store.getActions().auth.singin({accessToken, refreshToken});
      }
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
          // L'email è sbagliata
          formik.setFieldError("email", "L'utente non esiste");
        else if (msg.includes("password"))
          // La password è sbagliata
          formik.setFieldError("password", "Password sbagliata");
        else if (msg.includes("verify"))
          // L'utente deve prima verificare il proprio account
          navigation.navigate("VerifyEmail", {email});
      } else {
        Snackbar.show({
          text: "Si è verificato un errore. Riprova più tardi",
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: "#FF596E",
        });
      }
    }
  }

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = formik;

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{flex: 1}}
      style={styles.scrollView}>
      <View style={styles.wrapper}>
        <InputText
          label="Email"
          value={values.email}
          errorMessage={touched.email ? errors.email : undefined}
          keyboardType="email-address"
          // @ts-ignore
          onChangeText={handleChange("email")}
          // @ts-ignore
          onBlur={handleBlur("email")}
        />

        <InputText
          label="Password"
          value={values.password}
          errorMessage={touched.password ? errors.password : undefined}
          secureTextEntry
          // @ts-ignore
          onChangeText={handleChange("password")}
          // @ts-ignore
          onBlur={handleBlur("password")}
        />

        <Text
          style={[
            styles.text,
            styles.link,
            {textAlign: "right", marginBottom: 20},
          ]}
          onPress={() => navigation.push("ForgotPassword")}>
          Password dimenticata?
        </Text>
        <TouchableOpacity
          style={[
            styles.submitWrapper,
            {opacity: formik.isSubmitting ? 0.6 : 1},
          ]}
          onPress={handleSubmit as any}
          disabled={formik.isSubmitting}>
          {formik.isSubmitting ? (
            <ActivityIndicator color="#fff" style={{marginLeft: 10}} />
          ) : (
            <Text style={styles.submitText}>Accedi</Text>
          )}
        </TouchableOpacity>

        <Text style={[styles.text, styles.or]}>Oppure</Text>

        <GoogleSigninButton />

        <Text style={[styles.text, styles.registerText]}>
          Non hai un account?{" "}
          <Text
            style={[styles.text, styles.link]}
            onPress={() => navigation.push("SignUp")}>
            Registrati ora
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 30,
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    // fontFamily: "Avenir Next",
    color: "#404040",
  },
  submitWrapper: {
    backgroundColor: "#FF596E",
    borderRadius: 4,
    paddingVertical: 12,
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {width: 0, height: 9},
    shadowColor: "#FF596E",
    shadowOpacity: 1,
    elevation: 3,
    shadowRadius: 20,
    flexDirection: "row",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#FF1654",
    fontSize: 14,
    fontWeight: "500",
  },
  or: {
    color: "#ABB4BD",
    fontSize: 15,
    textAlign: "center",
    marginVertical: 35,
  },
  registerText: {
    fontSize: 14,
    color: "#ABB4BD",
    textAlign: "center",
    marginTop: 26,
  },
});
