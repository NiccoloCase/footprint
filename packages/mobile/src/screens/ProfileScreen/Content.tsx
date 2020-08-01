import React, {useRef, useState} from "react";
import {
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import {Spacing, Colors} from "../../styles";
import Animated from "react-native-reanimated";
import {MAX_HEADER_HEIGHT, HEADER_DELTA, MIN_HEADER_HEIGHT} from "./dimensions";
import {FollowerCard} from "./cards/FollowersCard";
import {MapCard} from "./cards/MapCard";
import {FootprintsCard} from "./cards/FootprintsCard";
import Icon from "react-native-vector-icons/FontAwesome5";
import {TouchableHighlight} from "react-native-gesture-handler";
import {User} from "../../generated/graphql";
const {Extrapolate, interpolate} = Animated;

interface ContentProps {
  y: Animated.Value<number>;
  user: User;
}

export const Content: React.FC<ContentProps> = ({y, user}) => {
  const scrollView = useRef<Animated.ScrollView>(null);
  // direzion della freccia del bottone per espandere la schermata
  const [buttonArrowDirection, setButtonArrowDirection] = useState<
    "up" | "down"
  >("up");

  const borderRadius = interpolate(y, {
    inputRange: [HEADER_DELTA - 50, HEADER_DELTA],
    outputRange: [15, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const buttonRotation = interpolate(y, {
    inputRange: [MAX_HEADER_HEIGHT / 2 - 10, MAX_HEADER_HEIGHT / 2 + 10],
    outputRange: [0, Math.PI],
    extrapolate: Extrapolate.CLAMP,
  });

  /**
   * Espande (o riduce) la schermata scrollado la scrollView fino all'header
   */
  const scroll = () => {
    if (scrollView.current && scrollView.current.getNode) {
      const node = scrollView.current.getNode();
      if (node)
        node.scrollTo({
          x: 0,
          y:
            buttonArrowDirection === "up"
              ? MAX_HEADER_HEIGHT - MIN_HEADER_HEIGHT
              : 0,
          animated: true,
        });
    }
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset = e.nativeEvent.contentOffset.y;
    y.setValue(offset);

    if (offset > MAX_HEADER_HEIGHT / 2 && buttonArrowDirection === "up")
      setButtonArrowDirection("down");
    else if (offset < MAX_HEADER_HEIGHT / 2 && buttonArrowDirection === "down")
      setButtonArrowDirection("up");
  };

  return (
    <Animated.ScrollView
      ref={scrollView}
      onScroll={onScroll}
      contentContainerStyle={{paddingTop: MAX_HEADER_HEIGHT}}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={1}>
      <Animated.View
        style={[
          styles.container,
          {
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
          },
        ]}>
        <TouchableHighlight
          underlayColor="#eee"
          onPress={scroll}
          style={styles.arrow}>
          <Animated.View style={{transform: [{rotate: buttonRotation}]}}>
            <Icon name="chevron-up" color={Colors.darkGrey} size={22} />
          </Animated.View>
        </TouchableHighlight>
        {user.followers.length > 0 && (
          <FollowerCard followers={user.followers} />
        )}
        <MapCard userId={user.id} />
        <FootprintsCard />
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.screenHorizontalPadding,
    backgroundColor: "#fff",
  },
  arrow: {
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 35,
    borderRadius: 35 / 2,
    marginVertical: 2,
  },
});
