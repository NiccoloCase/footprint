import React from "react";
import {SkypeIndicator} from "react-native-indicators";

interface SpinnerProps {
  color?: string;
  size?: number;
}

export const Spinner: React.FC<SpinnerProps> = (props) => {
  return <SkypeIndicator {...props} />;
};
