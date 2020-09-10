import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParamList} from "../../../navigation";
import {Colors, Spacing} from "../../../styles";
import {GoogleSigninButton} from "../../../components/buttons";
import Svg, {Path} from "react-native-svg";

type WelcomeScreenProps = StackScreenProps<AuthStackParamList, "Welcome">;

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({navigation}) => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.container}>
        <View style={styles.topSection}>
          <Image
            source={require("../../../assets/images/logo-name.png")}
            style={styles.logo}
          />
          <View>
            <Text style={styles.title}>Benvenuto!</Text>
            <Text style={styles.subtitle}>
              Iniza a lasciare la tua impronta in tutto il mondo
            </Text>
          </View>
        </View>
        {/** LINK DI NAVIGAZIONE */}
        <View style={styles.bottomSection}>
          {/** MARGINE */}
          <Svg
            height="100"
            width="100%"
            viewBox="0 0 1440 320"
            style={styles.wave}>
            <Path
              fill="#fff"
              fill-opacity="1"
              d="M0,64L48,101.3C96,139,192,213,288,234.7C384,256,480,224,576,192C672,160,768,128,864,133.3C960,139,1056,181,1152,202.7C1248,224,1344,224,1392,224L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </Svg>
          <View style={styles.bottomSectionContent}>
            {/** LOGIN */}
            <TouchableOpacity
              style={[styles.button, {backgroundColor: Colors.primary}]}
              onPress={() => navigation.push("SignIn")}>
              <Text style={styles.buttonText}>Accedi</Text>
            </TouchableOpacity>
            {/** GOOGLE */}
            <GoogleSigninButton
              button={(onPress) => (
                <TouchableOpacity
                  style={[styles.button, {backgroundColor: "#eee"}]}
                  onPress={onPress}>
                  <Image
                    source={require("../../../assets/images/google-logo.png")}
                    style={styles.googleLogo}
                  />
                  <Text style={[styles.buttonText, {color: Colors.darkGrey}]}>
                    Accedi con Google
                  </Text>
                </TouchableOpacity>
              )}
            />
            {/** REGISTRAZIONE */}
            <TouchableOpacity
              style={[styles.button, {backgroundColor: "#eee"}]}
              onPress={() => navigation.push("SignUp")}>
              <Text style={[styles.buttonText, {color: Colors.darkGrey}]}>
                Registrati
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  topSection: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
    paddingBottom: 100,
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  logo: {
    width: 200,
    height: 50,
    resizeMode: "center",
    marginBottom: 25,
  },
  title: {
    marginBottom: 15,
    fontSize: 45,
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 25,
    color: "#fff",
    textAlign: "center",
  },
  bottomSection: {
    backgroundColor: "#fff",
    paddingVertical: 40,
  },
  wave: {
    position: "absolute",
    top: -95,
  },
  bottomSectionContent: {
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    paddingVertical: 18,
    marginVertical: 10,
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  googleLogo: {
    width: 21,
    height: 21,
    marginRight: 15,
    resizeMode: "contain",
  },
});
