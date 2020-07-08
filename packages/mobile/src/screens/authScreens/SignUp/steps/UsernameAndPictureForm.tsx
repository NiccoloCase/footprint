import React from "react";
import {ScrollView} from "react-native";
import {Avatar} from "react-native-elements";
import {OutlinedTextInput as InputText} from "../../../../components/inputs";
import {SignUpFormProps} from "../";

export const UsernameAndPictureForm: React.FC<SignUpFormProps> = (props) => {
  const {handleChange, handleBlur, values, errors, touched} = props.formikProps;

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
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
    </ScrollView>
  );
};
