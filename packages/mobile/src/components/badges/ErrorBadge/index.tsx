import React from "react";
import {TouchableOpacity, StyleProp, ViewStyle} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Colors} from "../../../styles";
import Snackbar from "react-native-snackbar";

interface ErrorBadgeProps {
  errorMessage?: string;
  style?: StyleProp<ViewStyle>;
}

export const ErrorBadge: React.FC<ErrorBadgeProps> = ({
  errorMessage,
  style,
}) => {
  const showMessage = () => {
    if (errorMessage)
      Snackbar.show({
        text: errorMessage,
        backgroundColor: Colors.primary,
        duration: Snackbar.LENGTH_SHORT,
      });
  };

  return (
    <TouchableOpacity onPress={showMessage} style={style}>
      <Icon name="error-outline" color={Colors.errorRed} size={22} />
    </TouchableOpacity>
  );
};
