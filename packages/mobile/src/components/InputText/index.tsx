import React from "react";
import {InputProps, Input} from "react-native-elements";

export const InputText: React.FC<InputProps> = (props) => {
  return (
    <Input
      {...props}
      labelStyle={{color: "#ABB4BD", fontSize: 15}}
      inputStyle={{
        borderBottomColor: "#D8D8D8",
        borderBottomWidth: 1,
      }}
    />
  );
};
