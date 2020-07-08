import * as React from "react";
import {
  TouchableOpacityProperties,
  TouchableOpacity,
  Text,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";
import {Colors} from "../../../styles";
import {Spinner} from "../../Spinner";

interface SubmitButtonProps extends TouchableOpacityProperties {
  /** titolo del bottone */
  title?: string;
  /** Stile del bottone */
  containerStyle?: StyleProp<ViewStyle>;
  /** Stile del titolo */
  textStyle?: StyleProp<TextStyle>;
  /** Se sta caricandp */
  isLoading?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
  title,
  containerStyle,
  textStyle,
  isLoading,
  children,
  disabled,
  ...props
}) => {
  const content = isLoading ? (
    <Spinner color="#fff" size={35} />
  ) : (
    <Text style={[styles.text, textStyle]}>{title}</Text>
  );

  return (
    <TouchableOpacity
      {...props}
      style={[
        styles.button,
        containerStyle,
        {opacity: disabled || isLoading ? 0.6 : 1},
      ]}
      disabled={disabled || isLoading}>
      {children ? children : content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: "center",
    maxWidth: 500,
    width: "100%",
    height: 55,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {width: 0, height: 9},
    shadowColor: Colors.primary,
    shadowOpacity: 1,
    elevation: 3,
    shadowRadius: 20,
    flexDirection: "row",
  },
  text: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
  },
});
