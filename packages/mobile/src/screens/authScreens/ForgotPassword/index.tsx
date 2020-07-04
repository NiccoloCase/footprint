import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParamList} from "../../../navigation";

/** Propietà della scheramata di registrazione */
type ForgotPasswordScreenProps = StackScreenProps<
  AuthStackParamList,
  "ForgotPassword"
>;

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  route,
}) => {
  return (
    <View style={styles.container}>
      <Text>Inserisci perfavore il codice che è stato inviato all'email </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
