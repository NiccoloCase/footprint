import React, {useEffect, useMemo} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from "react-native";
import Animated, {
  useCode,
  block,
  call,
  cond,
  eq,
  and,
  set,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import {
  onGestureEvent,
  useValues,
  snapPoint,
  timing,
} from "react-native-redash";
import {
  PanGestureHandler,
  State,
  TouchableOpacity,
  ScrollView,
} from "react-native-gesture-handler";
import {useMemoOne} from "use-memo-one";
import Icon from "react-native-vector-icons/FontAwesome5";
import {AppStackParamList} from "../../navigation";
import {StackScreenProps} from "@react-navigation/stack";
import {SharedElement} from "react-navigation-shared-element";
import {Spacing} from "../../styles";

//
import {MapCard} from "./cards/MapCard";

// Dimenzioni:
// @ts-ignore
const {height} = Dimensions.get("window");
const IMAGE_HEIGHT = /* (height * 90) / 100 */ height - 150;

type FootprintScreenProps = StackScreenProps<AppStackParamList, "Footprint">;

export const FootprintScreen: React.FC<FootprintScreenProps> = ({
  route,
  navigation,
}) => {
  const {id, title, image} = route.params;

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

  const borderRadius = interpolate(translateY, {
    inputRange: [0, 50],
    outputRange: [0, 15],
    extrapolate: Extrapolate.CLAMP,
  });

  const gestureHandler = useMemoOne(
    () => onGestureEvent({translationX, translationY, velocityY, state}),
    [state, translationX, translationY, velocityY],
  );

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

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
    <View style={styles.container}>
      {/*  <ScrollView style={styles.scrollView}> */}
      <PanGestureHandler {...gestureHandler}>
        <Animated.View
          style={{
            flex: 1,
            borderRadius: borderRadius,
            // overflow: "hidden",
            transform: [{translateX}, {translateY}, {scale}],
          }}>
          <View style={styles.imageContainer}>
            <SharedElement id={`footprint.${id}.image`}>
              <Animated.Image
                style={[styles.image, {}]}
                source={{uri: image}}
              />
            </SharedElement>

            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                flexDirection: "row",
                justifyContent: "flex-end",
                padding: 10,
              }}>
              <TouchableOpacity
                onPress={goBack}
                style={{
                  backgroundColor: "rgba(0,0,0,0.1)",
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Icon name="times" color="#eee" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </PanGestureHandler>

      <SafeAreaView>
        <Animated.View style={[styles.content]}>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
          <Text>ciao</Text>
        </Animated.View>
      </SafeAreaView>
      {/*  </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: IMAGE_HEIGHT,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  scrollView: {
    width: "100%",
  },
  content: {
    marginTop: IMAGE_HEIGHT,
    backgroundColor: "#fff",
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingVertical: 20,
  },
});
