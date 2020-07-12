import React from "react";
import {TextInput, TextInputProps, View, StyleSheet, Text} from "react-native";
import {Colors} from "../../../styles";

interface TextAreaProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({label, ...props}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{label}</Text>
      <TextInput
        {...props}
        multiline={true}
        numberOfLines={5}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    fontWeight: "bold",
    color: Colors.mediumGrey,
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#eee",
    textAlignVertical: "top",
    borderRadius: 10,
    fontSize: 20,
    color: Colors.darkGrey,
  },
});
