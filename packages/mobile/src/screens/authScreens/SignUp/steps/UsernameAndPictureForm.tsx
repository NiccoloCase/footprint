import React from "react";
import {View} from "react-native";
import {Avatar} from "react-native-elements";
import {InputText} from "../../../../components/InputText";
import {SignUpFormProps} from "../";

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

      {values.pictureURL ? (
        <Avatar rounded source={{uri: values.pictureURL}} activeOpacity={0.7} />
      ) : null}
    </View>
  );
};
