flash import React from "react";
import {StyleSheet, View} from "react-native";
import {Colors} from "../../styles";

export const SplashScreen = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});
