import React, {useState} from "react";
import {
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import Animated, {
  useCode,
  block,
  cond,
  eq,
  set,
  call,
  interpolate,
  Extrapolate,
  and,
} from "react-native-reanimated";
import {
  useValues,
  snapPoint,
  onGestureEvent,
  timing,
} from "react-native-redash";
import Icon from "react-native-vector-icons/FontAwesome5";
import {PanGestureHandler, State} from "react-native-gesture-handler";
import {useMemoOne} from "use-memo-one";
import {StackScreenProps} from "@react-navigation/stack";
import {AppStackParamList} from "../../navigation";

type MediaScreenProps = StackScreenProps<AppStackParamList, "Image">;

export const MediaScreen: React.FC<MediaScreenProps> = ({
  route,
  navigation,
}) => {
  const {uri} = route.params;
  const {height} = useWindowDimensions();

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  // Animazione:
  const [
    translationX,
    translationY,
    velocityY,
    translateX,
    translateY,
    snapBack,
    state,
  ] = useValues<number>(0, 0, 0, 0, 0, 0, State.UNDETERMINED);

  const snapTo = snapPoint(translationY, velocityY, [0, height]);

  const scale = interpolate(translateY, {
    inputRange: [0, height / 2],
    outputRange: [1, 0.75],
    extrapolate: Extrapolate.CLAMP,
  });

  const topBorderRadius = interpolate(translateY, {
    inputRange: [0, 50],
    outputRange: [0, 15],
    extrapolate: Extrapolate.CLAMP,
  });

  const bottomBorderRadius = interpolate(translateY, {
    inputRange: [-50, 0],
    outputRange: [15, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const gestureHandler = useMemoOne(
    () => onGestureEvent({translationX, translationY, velocityY, state}),
    [state, translationX, translationY, velocityY],
  );

  useCode(
    () =>
      block([
        cond(
          and(eq(state, State.END), eq(snapTo, height), eq(snapBack, 0)),
          set(snapBack, 1),
        ),
        cond(
          snapBack,
          call([], () => goBack()),
          cond(
            eq(state, State.END),
            [
              set(
                translateX,
                timing({from: translationX, to: 0, duration: 250}),
              ),
              set(
                translateY,
                timing({from: translationY, to: 0, duration: 250}),
              ),
            ],
            [set(translateX, translationX), set(translateY, translationY)],
          ),
        ),
      ]),
    [],
  );

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View
        style={[
          styles.container,
          {
            borderTopLeftRadius: topBorderRadius,
            borderTopRightRadius: topBorderRadius,
            borderBottomLeftRadius: bottomBorderRadius,
            borderBottomRightRadius: bottomBorderRadius,
            overflow: "hidden",
            transform: [{translateX}, {translateY}, {scale}],
          },
        ]}>
        <Image source={{uri}} style={styles.container} resizeMode="cover" />

        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.closeBtn}>
            <Icon name="times" color="#eee" size={24} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  closeBtn: {
    backgroundColor: "rgba(0,0,0,0.1)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
