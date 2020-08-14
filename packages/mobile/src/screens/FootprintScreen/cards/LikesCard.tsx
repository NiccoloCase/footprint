import React, {useState} from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {User} from "../../../generated/graphql";
import {useNavigation} from "@react-navigation/native";
import {SharedElement} from "react-navigation-shared-element";
import {Colors} from "../../../styles";
import {useNavigateToUserProfile} from "../../../navigation/navigateToUserProfile";
import {abbreviateNumber} from "../../../utils/abbreviateNumber";

const AVATAR_RADIUS = 28;

interface LikesCardProps {
  footprintId: string;
  likes: Pick<User, "username" | "id" | "profileImage">[];
  likesCount: number;
}

export const LikesCard: React.FC<LikesCardProps> = ({
  footprintId,
  likes,
  likesCount: defaultLikesCount,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(defaultLikesCount);

  // Navigazione:
  const navigateToProfile = useNavigateToUserProfile();
  const navigation = useNavigation();

  const goToFollowersScreen = () => {
    // navigation.navigate("FollowersScreen", {userId});
  };

  const handleButtonPress = () => {
    // aggiorna il numero di likes
    setLikesCount(likesCount + (!isLiked ? 1 : -1));

    // aggiorna lo stato del bottone
    setIsLiked(!isLiked);
  };

  const renderAvatar = (
    name: string,
    uri: string,
    index: number,
    followerId: string,
  ) => (
    <View
      key={index}
      style={[
        styles.avatarContainer,
        {marginRight: index === likes.length - 1 ? 0 : 15},
      ]}>
      <TouchableOpacity onPress={() => navigateToProfile(followerId)}>
        <Image source={{uri}} style={styles.avatar} />
      </TouchableOpacity>
      <Text style={{color: "#505050"}}>{name}</Text>
    </View>
  );

  return (
    <SharedElement id={`followers.card`}>
      <View style={styles.card}>
        <View style={styles.inline}>
          <SharedElement id={`followers.card.title`}>
            <Text style={[styles.text, styles.sectionTitle]}>Likes</Text>
          </SharedElement>
          <TouchableOpacity onPress={goToFollowersScreen}>
            <SharedElement id={`followers.card.link`}>
              <Text style={[styles.text, styles.link]}>Vedi tutti</Text>
            </SharedElement>
          </TouchableOpacity>
        </View>
        <View style={styles.inline}>
          <View style={styles.likeButtonWrapper}>
            <TouchableOpacity onPress={handleButtonPress}>
              <AntDesignIcon
                name={isLiked ? "heart" : "hearto"}
                color={Colors.primary}
                size={34}
              />
              <Text style={styles.likesCount}>
                {abbreviateNumber(likesCount)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{flex: 1}}>
            <SharedElement id={`followers.card.content`}>
              <ScrollView horizontal style={styles.followers}>
                {likes.map((user, index) =>
                  renderAvatar(
                    user.username,
                    user.profileImage,
                    index,
                    user.id,
                  ),
                )}
              </ScrollView>
            </SharedElement>
          </View>
        </View>
      </View>
    </SharedElement>
  );
};

const styles = StyleSheet.create({
  followers: {
    marginTop: 15,
  },
  avatarContainer: {
    alignItems: "center",
  },
  avatar: {
    width: AVATAR_RADIUS * 2,
    height: AVATAR_RADIUS * 2,
    borderRadius: AVATAR_RADIUS,
    marginBottom: 8,
  },
  // CARD
  card: {
    marginTop: 35,
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
  likesCount: {
    color: Colors.primary,
    fontWeight: "bold",
    fontSize: 16,
  },
  likeButtonWrapper: {
    marginRight: 25,
    paddingRight: 25,
    borderRightColor: "#ddd",
    borderRightWidth: 2,
  },
});
