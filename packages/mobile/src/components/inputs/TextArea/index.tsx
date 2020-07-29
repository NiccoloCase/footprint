import React from "react";
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import {Colors} from "../../../styles";

interface TextAreaProps extends TextInputProps {
  label?: string;
  errorMessage?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  containerStyle,
  errorMessage,
  ...props
}) => {
  return (
    <View style={containerStyle}>
      <Text style={styles.title}>{label}</Text>
      <TextInput
        {...props}
        multiline={true}
        numberOfLines={6}
        style={styles.input}
      />
      <View style={styles.errorWrapper}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    color: Colors.darkGrey,
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f3f3f3",
    textAlignVertical: "top",
    borderRadius: 5,
    fontSize: 20,
    color: Colors.mediumGrey,
  },
  errorWrapper: {},
  errorMessage: {
    color: "red",
  },
});
