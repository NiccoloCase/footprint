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
  /** Colore del background */
  backgroundColor?: string;
}

const OutlinedTextInput: React.FC<OutlinedTextInputProps> = ({
  label,
  password,
  email,
  errorMessage,
  containerStyle,
  labelStyle,
  backgroundColor,
  onBlur,
  onFocus,
  ...props
}) => {
  // Se la casella è selezionata
  const [isFocused, setIsFocused] = useState(false);
  // Se la password è visibile
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // ANIMAZIONI:
  const animatedIsFocused = useRef(
    new Animated.Value(props.value === "" ? 0 : 1),
  ).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || props.value !== "" ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const color = animatedIsFocused.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.lightGrey, "#C8C8C8"],
  });

  /**
   * Funzione chimata quando l'input viene selezionato
   */
  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  /**
   * Funzione chimata quando l'input viene deselezionato
   */
  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

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
    <View style={[styles.container, {backgroundColor}, containerStyle]}>
      <Animated.View
        pointerEvents="none"
        style={{
          ...styles.labelWrapper,
          backgroundColor,
          top: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [HEIGHT / 2 + 2, 0],
          }),
          left: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [10, 15],
          }),
          paddingHorizontal: animatedIsFocused.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 10],
          }),
        }}>
        <Animated.Text
          style={[
            styles.label,
            labelStyle,
            {
              color,
              fontSize: animatedIsFocused.interpolate({
                inputRange: [0, 1],
                outputRange: [18, 16],
              }),
            },
          ]}>
          {label}
        </Animated.Text>
      </Animated.View>

      <Animated.View style={[styles.inputWrapper, {borderColor: color}]}>
        <TextInput
          {...getAdditionalProps()}
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
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
      </Animated.View>
      <View style={styles.errorWrapper}>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 11,
  },
  labelWrapper: {
    zIndex: 2,
    position: "absolute",
  },
  label: {
    fontWeight: "bold",
  },
  inputWrapper: {
    flexDirection: "row",
    borderWidth: 2.5,
    borderRadius: 10,
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

OutlinedTextInput.defaultProps = {
  backgroundColor: "#fff",
};

export {OutlinedTextInput};
