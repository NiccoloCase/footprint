import React from "react";
import LottieView from "lottie-react-native";

export const LogoSpinner = () => {
  return (
    <LottieView
      source={require("../../assets/lottie/logo-spinner.json")}
      resizeMode="cover"
      style={{width: 130, height: 130}}
      autoPlay
      loop
    />
  );
};
