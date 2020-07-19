import React from "react";
import {TouchableHighlight, StyleSheet, View} from "react-native";
import Animated from "react-native-reanimated";
import Icon from "react-native-vector-icons/FontAwesome5";
import {Spacing} from "../../styles";
import {HEADER_DELTA, MIN_HEADER_HEIGHT} from "./dimensions";
import {useNavigation} from "@react-navigation/native";
const {Extrapolate, interpolate, color} = Animated;

interface HeaderProps {
  y: Animated.Value<number>;
  opacity: Animated.Node<number>;
  username: string;
  personal?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  y,
  opacity,
  username,
  personal,
}) => {
  const navigation = useNavigation();

  const titleOpacity = interpolate(y, {
    inputRange: [HEADER_DELTA - 40, HEADER_DELTA + 10],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <Animated.View
      style={[styles.container, {backgroundColor: color(48, 48, 48, opacity)}]}>
      <View style={styles.button}>
        {navigation.canGoBack() && (
          <TouchableHighlight
            style={styles.button}
            onPress={goBack}
            underlayColor="rgba(0,0,0,0.1)">
            <Icon name="chevron-left" color="#fff" size={20} />
          </TouchableHighlight>
        )}
      </View>
      <Animated.Text
        style={[styles.title, {opacity: titleOpacity}]}
        numberOfLines={1}>
        {username}
      </Animated.Text>
      <TouchableHighlight
        onPress={() => {}}
        underlayColor="rgba(0,0,0,0.2)"
        style={styles.button}>
        {personal ? (
          <Icon name="edit" color="#fff" size={20} />
        ) : (
          <Icon name="share-alt" color="#fff" size={20} />
        )}
      </TouchableHighlight>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: MIN_HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  button: {
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
});
