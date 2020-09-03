import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {User} from "../../../generated/graphql";
import {SharedElement} from "react-navigation-shared-element";
import {Colors} from "../../../styles";
import {useNavigateToUserProfile} from "../../../navigation/navigateToUserProfile";
import {abbreviateNumber} from "../../../utils/abbreviateNumber";
import {useNavigation} from "@react-navigation/native";
import {useFootprintLikes} from "../../../utils/hooks";

const AVATAR_RADIUS = 28;

interface LikesCardProps {
  footprintId: string;
  footprintAuthor: string;
  isAlredyLiked?: boolean;
  likes: Pick<User, "username" | "id" | "profileImage">[];
  likesCount: number;
}

export const LikesCard: React.FC<LikesCardProps> = ({
  likes,
  footprintId,
  footprintAuthor,
  likesCount,
  isAlredyLiked,
}) => {
  const [isLiked, handleButtonPress] = useFootprintLikes(
    footprintId,
    footprintAuthor,
    isAlredyLiked,
  );

  // Navigazione:
  const navigateToProfile = useNavigateToUserProfile();
  const navigation = useNavigation();

  const goToFollowersScreen = () => {
    // navigation.navigate("FollowersScreen", {userId}); <--------- TODO
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
            <TouchableOpacity
              onPress={handleButtonPress}
              style={styles.likeButton}>
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
  likeButton: {
    alignItems: "center",
  },
});
