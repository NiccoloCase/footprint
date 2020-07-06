import React from "react";
import {View} from "react-native";
import {PulseIndicator} from "react-native-indicators";
import {Colors} from "../../styles";

export const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary,
      }}>
      <PulseIndicator color="#fff" size={80} />
    </View>
  );
};
