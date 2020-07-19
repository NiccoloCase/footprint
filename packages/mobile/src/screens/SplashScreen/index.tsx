import React from "react";
import {View, StatusBar} from "react-native";
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
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      <PulseIndicator color="#fff" size={80} />
    </View>
  );
};
