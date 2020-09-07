import React from "react";
import {StyleSheet, View, StatusBar} from "react-native";
import {Colors} from "../../styles";

export const SplashScreen = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={styles.container} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});
