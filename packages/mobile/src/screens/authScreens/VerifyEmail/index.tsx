import React from "react";
import {View, Text, StyleSheet} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AuthStackParamList} from "../../../navigation";

/** Propietà della scheramata di registrazione */
type VerifyEmailScreenProps = StackScreenProps<
  AuthStackParamList,
  "VerifyEmail"
>;

export const VerifyEmail: React.FC<VerifyEmailScreenProps> = ({route}) => {
  const {username, email} = route.params;

  return (
    <View style={styles.container}>
      <Text>Abbiamo quasi finito {username}!</Text>
      <Text>
        Devi solo confermare l'email inserita in fase di registrazione
      </Text>
      <Text>
        Inserisci perfavore il codice che è stato inviato all'email{" "}
        <Text style={{fontStyle: "italic"}}> {email}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
