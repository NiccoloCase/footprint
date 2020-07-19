import React, {useState} from "react";
import {View, StyleSheet, Image, Text} from "react-native";
import {BlurView} from "@react-native-community/blur";
import Animated from "react-native-reanimated";
import {
  MAX_HEADER_HEIGHT,
  MIN_HEADER_HEIGHT,
  PROIFLE_IMAGE_MAX_RADIUS,
} from "./dimensions";
import {Colors} from "../../styles";
import {TouchableHighlight} from "react-native-gesture-handler";
import {abbreviateNumber} from "../../utils/abbreviateNumber";
import {User} from "../../generated/graphql";

const {interpolate, Extrapolate} = Animated;

interface CoverProps {
  y: Animated.Value<number>;
  opacity: Animated.Node<number>;
  user: User;
}

export const Cover: React.FC<CoverProps> = ({y, opacity, user}) => {
  const [isFollowed, setIsFollowed] = useState(false);
  const [followers, setFollowers] = useState(20);

  const scale = interpolate(y, {
    inputRange: [-MAX_HEADER_HEIGHT, 0],
    outputRange: [4, 1],
    extrapolateRight: Extrapolate.CLAMP,
  });

  const handleFollowButton = () => {
    // aggiorna lo stato
    setFollowers(followers + (isFollowed ? -1 : 1));
    setIsFollowed(!isFollowed);
  };

  const {profileImage, username, followersCount, followingCount} = user;

  return (
    <Animated.View style={[styles.container, {transform: [{scale}]}]}>
      {/* IMMAGINE DI SOFONDO */}
      <Image
        style={{
          ...StyleSheet.absoluteFillObject,
          resizeMode: "cover",
        }}
        source={{uri: profileImage}}
      />
      {/* BLUR OVERLAY */}
      <BlurView
        style={StyleSheet.absoluteFillObject}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="white"
      />
      {/* AVATAR */}
      <View>
        <View style={styles.avatar}>
          <Image
            source={{uri: profileImage}}
            style={{flex: 1, width: null, height: null} as any}
          />
        </View>
        <Animated.Text style={[styles.username]}>{username}</Animated.Text>
      </View>
      {/** BOTTONE SEGUI - NON SEGUIRE  */}
      <TouchableHighlight
        style={styles.button}
        onPress={handleFollowButton}
        underlayColor="rgba(255, 89, 110, .8)">
        <Text style={styles.buttonText}>
          {isFollowed ? "Non seguire" : "Segui"}
        </Text>
      </TouchableHighlight>

      <View style={styles.infoBox}>
        {/*FOLLOWERS*/}
        <View style={styles.counterBox}>
          <Text style={styles.count}>{abbreviateNumber(followersCount)}</Text>
          <Text style={styles.countTitle}>Follower</Text>
        </View>
        <View style={[styles.divider, {borderRightWidth: 1}]} />

        {/*FOLLOWING*/}
        <View style={styles.counterBox}>
          <Text style={styles.count}>{abbreviateNumber(followingCount)}</Text>
          <Text style={styles.countTitle}>Seguiti</Text>
        </View>
        <View style={[styles.divider, {borderLeftWidth: 1}]} />

        {/*FOOTPRINT*/}
        <View style={styles.counterBox}>
          <Text style={styles.count}>{abbreviateNumber(30000)}</Text>
          <Text style={styles.countTitle}>Footprint</Text>
        </View>
      </View>

      {/* OVERLAY */}
      <Animated.View style={[styles.overlay, {opacity}]} />
    </Animated.View>
  );
};

const offset = 5;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: MAX_HEADER_HEIGHT + offset,
    //paddingTop: MIN_HEADER_HEIGHT,
    paddingTop: 25,
    paddingBottom: 25 + offset,
    justifyContent: "space-around",
    backgroundColor: "#303030",
  },
  avatar: {
    height: PROIFLE_IMAGE_MAX_RADIUS * 2,
    width: PROIFLE_IMAGE_MAX_RADIUS * 2,
    borderRadius: PROIFLE_IMAGE_MAX_RADIUS,
    overflow: "hidden",
    alignSelf: "center",
  },
  username: {
    textAlign: "center",
    marginTop: 15,
    color: "#eee",
    fontSize: 28,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: Colors.primary,
    alignSelf: "center",
    alignItems: "center",
    paddingVertical: 13,
    width: 160,
    borderRadius: 50,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    top: MIN_HEADER_HEIGHT,
    backgroundColor: "#303030",
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "85%",
    marginHorizontal: 15,
  },
  counterBox: {
    paddingHorizontal: 15,
    borderColor: "#fff",
  },
  count: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 22,
    textAlign: "center",
  },
  countTitle: {
    color: Colors.lightGrey,
    fontSize: 16,
    marginTop: 8,
  },
  divider: {
    borderColor: Colors.lightGrey,
    height: "80%",
    alignSelf: "center",
  },
});
