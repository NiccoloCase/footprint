import React from "react";
import {View} from "react-native";
import {PulseIndicator} from "react-native-indicators";

export const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF596E",
      }}>
      <PulseIndicator color="#fff" size={80} />
    </View>
  );
};
