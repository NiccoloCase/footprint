import React, {useState, useContext} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TouchableNativeFeedback,
} from "react-native";
import {User} from "@react-native-community/google-signin";
import FeatherIcon from "react-native-vector-icons/Feather";
import {StackScreenProps} from "@react-navigation/stack";
import {useLoginMutation} from "../../../generated/graphql";
import {AuthStackParamList} from "../../../navigation";
import {InputText} from "../../../components/InputText";
import {GoogleSigninButton} from "../../../components/GoogleSigninButton";
import {store} from "../../../store";

type SignInScreenProps = StackScreenProps<AuthStackParamList, "SignIn">;

export const SignInScreen: React.FC<SignInScreenProps> = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // GRAPHQL
  const [login] = useLoginMutation();

  const _hasErrors = () => {
    return email.includes("a");
  };

  /**
   * Esegue il login locale (con email e password)
   */
  const handleSubmit = async () => {
    try {
      const {data} = await login({variables: {email, password}});

      if (data) {
        const {accessToken, refreshToken} = data.login;
        store.getActions().auth.singin({accessToken, refreshToken});
      }
    } catch (err) {
      if (err.graphQLErrors && err.graphQLErrors.message)
        console.log(err.graphQLErrors.message.statusCode);
    }
  };

  const onLoggedWithGoogle = (user: User) => {
    // LOGIN LOGIC
    // ....
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{flex: 1}}
      style={styles.scrollView}>
      <View style={styles.wrapper}>
        <InputText
          label="Email"
          value={email}
          onChangeText={setEmail}
          errorMessage={_hasErrors() ? "Email address is invalid!" : undefined}
          textContentType="emailAddress"
          autoCompleteType="email"
          keyboardType="email-address"
        />
        <InputText
          label="Password"
          value={password}
          onChangeText={setPassword}
          errorMessage={_hasErrors() ? "Email address is invalid!" : undefined}
          textContentType="password"
          secureTextEntry={!isPasswordVisible}
          rightIcon={
            <TouchableNativeFeedback
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <FeatherIcon
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={25}
                color="#ABB4BD"
              />
            </TouchableNativeFeedback>
          }
        />
        <Text
          style={[
            styles.text,
            styles.link,
            {textAlign: "right", marginBottom: 20},
          ]}>
          Password dimenticata?
        </Text>
        <TouchableOpacity style={styles.submitWrapper} onPress={handleSubmit}>
          <Text style={styles.submitText}>Accedi</Text>
        </TouchableOpacity>

        <Text style={[styles.text, styles.or]}>Oppure</Text>

        <GoogleSigninButton onLoginSuccess={onLoggedWithGoogle} />

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
