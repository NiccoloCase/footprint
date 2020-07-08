import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {SignUpFormProps} from "../";
import {OutlinedTextInput as InputText} from "../../../../components/inputs";
import {GoogleSigninButton} from "../../../../components/buttons";
import {Colors} from "../../../../styles";
import {ScrollView} from "react-native-gesture-handler";

export const EmailAndPasswordForm: React.FC<SignUpFormProps> = (props) => {
  const {handleChange, handleBlur, values, errors, touched} = props.formikProps;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <InputText
          label="Email"
          email
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          value={values.email}
          errorMessage={touched.email ? errors.email : undefined}
          containerStyle={{marginBottom: 20}}
        />
        <InputText
          label="Password"
          password
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
          value={values.password}
          errorMessage={touched.password ? errors.password : undefined}
          containerStyle={{marginBottom: 20}}
        />
        <InputText
          label="Conferma la password"
          password
          onChangeText={handleChange("password2")}
          onBlur={handleBlur("password2")}
          value={values.password2}
          errorMessage={touched.password2 ? errors.password2 : undefined}
        />
      </View>

      {/** OPPURE */}
      <View style={styles.orWrapper}>
        <View style={styles.orLine} />
        <Text style={[styles.text, styles.orText]}>Oppure</Text>
      </View>

      {/** GOOGLE */}
      <GoogleSigninButton label="Continua con google" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "space-evenly",
    marginBottom: 40,
  },
  text: {
    // fontFamily: "Avenir Next",
    fontSize: 14,
    color: Colors.darkGrey,
  },
  orWrapper: {
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
});
