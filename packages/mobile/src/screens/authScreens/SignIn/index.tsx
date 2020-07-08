/*
  Ispirazione: https://dribbble.com/shots/6774711-Onboarding-Login-Sign-Up
*/

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useFormik} from "formik";
import {StackScreenProps} from "@react-navigation/stack";
import {useLoginMutation} from "../../../generated/graphql";
import {AuthStackParamList} from "../../../navigation";
import {OutlinedTextInput as InputText} from "../../../components/inputs";
import {store} from "../../../store";
import {SignInValidationSchema} from "../../../utils/validation";
import Snackbar from "react-native-snackbar";
import {Colors, Spacing} from "../../../styles";
import {SubmitButton, GoogleSigninButton} from "../../../components/buttons";
import {AuthHeader} from "../../../components/Header/AuthHeader";

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
    // validateOnBlur: false,
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
          backgroundColor: Colors.primary,
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {/** HEADER */}
        <AuthHeader title="Benevenuto," subtitle="Accedi per continuare!" />
        {/** INPUT */}
        <View style={{zIndex: 100}}>
          <InputText
            label="Email"
            email
            value={values.email}
            errorMessage={touched.email ? errors.email : undefined}
            onChangeText={handleChange("email") as any}
            onBlur={handleBlur("email") as any}
            containerStyle={{marginBottom: 30}}
          />
          <InputText
            label="Password"
            password
            value={values.password}
            errorMessage={touched.password ? errors.password : undefined}
            onChangeText={handleChange("password") as any}
            onBlur={handleBlur("password") as any}
          />
          {/** PASSOWORD DIMENTICATA */}
          <View style={{flexDirection: "row-reverse"}}>
            <Text
              style={[styles.text, styles.forgotPassword]}
              onPress={() => navigation.push("ForgotPassword")}>
              Password dimenticata?
            </Text>
          </View>

          {/** BOTTONI */}
          <View style={{marginTop: 30}}>
            {/** SUBMIT */}
            <SubmitButton
              title="Accedi"
              onPress={handleSubmit as any}
              isLoading={formik.isSubmitting}
            />

            {/** OPPURE */}
            <View style={styles.orWrapper}>
              <View style={styles.orLine} />
              <Text style={[styles.text, styles.orText]}>Oppure</Text>
            </View>

            {/** GOOGLE */}
            <GoogleSigninButton />
          </View>
        </View>

        {/** LINK PER LA SCHERMATA DI REGISTRAZIONE  */}
        <Text style={[styles.text, styles.registerText]}>
          Non hai un account?{" "}
          <Text
            style={[styles.text, styles.link]}
            onPress={() => navigation.push("SignUp")}>
            Registrati ora
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  scrollView: {
    flex: 1,
    maxWidth: Spacing.maxScreenWidth,
    alignSelf: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  text: {
    // fontFamily: "Avenir Next",
    fontSize: 14,
    color: Colors.darkGrey,
  },
  link: {
    color: "#FF1654",
    fontSize: 14,
    fontWeight: "bold",
  },
  forgotPassword: {
    textAlign: "right",
    marginBottom: 20,
    fontWeight: "bold",
  },
  orWrapper: {
    marginVertical: 35,
    position: "relative",
    overflow: "visible",
    alignItems: "center",
  },
  orLine: {
    backgroundColor: Colors.lightGrey,
    position: "absolute",
    top: "50%",
    left: 0,
    width: "100%",
    height: 1.2,
    borderRadius: 5,
  },
  orText: {
    paddingHorizontal: 20,
    fontSize: 15,
    color: "#ABB4BD",
    backgroundColor: "#fff",
  },
  registerText: {
    color: Colors.mediumGrey,
    textAlign: "center",
    marginBottom: 15,
  },
});
