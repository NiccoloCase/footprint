import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import {Colors} from "../../../styles";
import Animated from "react-native-reanimated";
import {SharedElement} from "react-navigation-shared-element";

interface CardProps {
  title?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  cardId?: string;
  titleId?: string;
  linkId?: string;
}

export const Card: React.FC<CardProps> = (props) => {
  const onPress = () => {
    const {onButtonPress} = props;
    if (typeof onButtonPress === "function") onButtonPress();
  };

  return (
    <SharedElement id={props.cardId || ""}>
      <Animated.View style={[styles.card, props.containerStyle]}>
        <View style={styles.inline}>
          <SharedElement id={props.titleId || ""}>
            <Text style={[styles.text, styles.sectionTitle]}>
              {props.title}
            </Text>
          </SharedElement>
          <TouchableOpacity onPress={onPress}>
            <SharedElement id={props.linkId || ""}>
              <Text style={[styles.text, styles.link]}>{props.buttonText}</Text>
            </SharedElement>
          </TouchableOpacity>
        </View>
        {props.children}
      </Animated.View>
    </SharedElement>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#eee",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginBottom: 25,
    // ombra:
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
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
    fontSize: 17,
  },
  link: {
    fontSize: 15,
    color: Colors.primary,
  },
});
