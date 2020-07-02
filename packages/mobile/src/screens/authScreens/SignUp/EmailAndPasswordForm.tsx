import React from "react";
import {View, Text} from "react-native";
import {SignUpFormProps} from "./";
import {InputText} from "../../../components/InputText";
import {GoogleSigninButton} from "../../../components/GoogleSigninButton";

export const EmailAndPasswordForm: React.FC<SignUpFormProps> = (props) => {
  const {handleChange, handleBlur, values, errors, touched} = props.formikProps;

  return (
    <View>
      <View>
        <InputText
          label="Email"
          onChangeText={handleChange("email")}
          onBlur={handleBlur("email")}
          value={values.email}
          errorMessage={touched.email ? errors.email : undefined}
          keyboardType="email-address"
        />
        <InputText
          label="Password"
          onChangeText={handleChange("password")}
          onBlur={handleBlur("password")}
          value={values.password}
          errorMessage={touched.password ? errors.password : undefined}
          secureTextEntry
        />
        <InputText
          label="Conferma la password"
          onChangeText={handleChange("password2")}
          onBlur={handleBlur("password2")}
          value={values.password2}
          errorMessage={touched.password2 ? errors.password2 : undefined}
          secureTextEntry
        />
      </View>
      <Text> Oppure </Text>
      <GoogleSigninButton label="Continua con google" />
    </View>
  );
};
