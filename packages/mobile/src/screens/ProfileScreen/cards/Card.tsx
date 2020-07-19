import React, {useState, ReactNode} from "react";
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {Colors} from "../../../styles";
import Animated from "react-native-reanimated";

interface CardProps {
  title?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

export const Card: React.FC<CardProps> = (props) => {
  const onPress = () => {
    const {onButtonPress} = props;
    if (typeof onButtonPress === "function") onButtonPress();
  };

  return (
    <Animated.View style={styles.card}>
      <View style={styles.inline}>
        <Text style={[styles.text, styles.sectionTitle]}>{props.title}</Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={[styles.text, styles.link]}>{props.buttonText}</Text>
        </TouchableOpacity>
      </View>
      {props.children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#eee",
    borderRadius: 10,
    padding: 20,
    marginBottom: 25,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: {
    color: "#404040",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    fontSize: 15,
    color: Colors.primary,
  },
});
