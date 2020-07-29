import React, {useState, useEffect, useRef} from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  TextInputProps,
  TouchableNativeFeedback,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import {Colors} from "../../../styles";

const HEIGHT = 55;

interface OutlinedTextInputProps extends TextInputProps {
  /** Titolo */
  label?: string;
  /** Se l'input contiene una pasword*/
  password?: boolean;
  /** Se l'input contiene un email */
  email?: boolean;
  /** Messaggio di errore */
  errorMessage?: string;
  /** Stile del contenitore */
  containerStyle?: StyleProp<ViewStyle>;
  /** Stile del label */
  labelStyle?: StyleProp<TextStyle>;
}

export const SolidInput: React.FC<OutlinedTextInputProps> = ({
  label,
  password,
  email,
  errorMessage,
  containerStyle,
  labelStyle,
  onBlur,
  onFocus,
  ...props
}) => {
  // Se la password è visibile
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  /**
   * Funzione chimata quando viene cliccta l'icona alla destra
   * dell'input
   */
  const onRightIconClick = () => {
    if (password) setIsPasswordVisible(!isPasswordVisible);
  };

  /**
   * Calcola a seconda del contesto e restituisce tutte le altre propietà
   * dell'TextInput
   */
  const getAdditionalProps = () => {
    // Se l'input è una password
    if (password) {
      props.secureTextEntry = !isPasswordVisible;
      props.textContentType = "password";
      if (isPasswordVisible) props.keyboardType = "visible-password";
    }
    // Se l'input è una email
    if (email) {
      props.keyboardType = "email-address";
      props.textContentType = "emailAddress";
    }

    return props;
  };

  return (
    <View style={containerStyle}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>

      <View style={styles.inputWrapper}>
        <TextInput
          {...getAdditionalProps()}
          style={styles.input}
          blurOnSubmit
        />
        {password && (
          <View style={styles.rightIconWrapper}>
            <TouchableNativeFeedback onPress={onRightIconClick}>
              <FeatherIcon
                name={isPasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="#C8C8C8"
              />
            </TouchableNativeFeedback>
          </View>
        )}
      </View>
      <View style={styles.errorWrapper}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  labelWrapper: {
    zIndex: 2,
    position: "absolute",
  },
  label: {
    fontWeight: "bold",
    color: Colors.darkGrey,
    fontSize: 16,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#f3f3f3",
  },
  input: {
    height: HEIGHT,
    fontSize: 20,
    color: Colors.darkGrey,
    flex: 1,
  },
  rightIconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  errorWrapper: {},
  errorMessage: {
    color: "red",
  },
});
