import React from "react";
import {View} from "react-native";
import {SignUpFormProps} from "./";
import {InputText} from "../../../components/InputText";

export const UsernameAndPictureForm: React.FC<SignUpFormProps> = (props) => {
  const {handleChange, handleBlur, values, errors, touched} = props.formikProps;

  return (
    <View>
      <InputText
        label="Username"
        onChangeText={handleChange("username")}
        onBlur={handleBlur("username")}
        value={values.username}
        errorMessage={touched.username ? errors.username : undefined}
      />
    </View>
  );
};
