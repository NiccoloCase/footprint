import React, {useState} from "react";
import {View, Text, Button} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {useRegisterMutation} from "../../../generated/graphql";
import {AuthStackParamList} from "../../../navigation";
import {InputText} from "../../../components/InputText";

type SignUpScreenProps = StackScreenProps<AuthStackParamList, "SignUp">;

export const SignUpScreen: React.FC<SignUpScreenProps> = ({navigation}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup] = useRegisterMutation();

  const handleSubmit = async () => {
    try {
      const {data, errors} = await signup({
        variables: {username, email, password},
      });
      console.log(data, errors);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>SignUp</Text>
      <InputText
        label="Username"
        value={username}
        onChangeText={setUsername}
        textContentType="username"
      />
      <InputText
        label="Email"
        value={email}
        onChangeText={setEmail}
        textContentType="emailAddress"
      />
      <InputText
        label="Email"
        value={password}
        onChangeText={setPassword}
        textContentType="password"
        secureTextEntry
      />
      <Button title="Crea account" onPress={handleSubmit} />
    </View>
  );
};
