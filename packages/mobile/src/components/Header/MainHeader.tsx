import React from "react";
import {StyleSheet, Text, View} from "react-native";
import {Colors, Spacing} from "../../styles";

export const MainHeader = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerWrapper}>
        <Text style={styles.headerTitle}>Footprint</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#fff",
    elevation: 3,
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingVertical: 10,
  },
  headerWrapper: {
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 22,
    color: Colors.primary,
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
