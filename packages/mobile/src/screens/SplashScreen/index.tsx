import React from "react";
import {View, Text} from "react-native";

export const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF596E",
      }}>
      <Text style={{color: "#fff"}}>Caricamento...</Text>
    </View>
  );
};
