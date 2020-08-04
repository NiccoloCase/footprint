import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import {ScrollView, TouchableOpacity} from "react-native-gesture-handler";
import {User} from "../../../generated/graphql";
import {useNavigation} from "@react-navigation/native";
import {SharedElement} from "react-navigation-shared-element";
import {Colors} from "../../../styles";
import {useNavigateToUserProfile} from "../../../navigation/navigateToUserProfile";

const AVATAR_RADIUS = 32;

interface FollowerCardProps {
  followers: User[];
  userId: string;
}

export const FollowerCard: React.FC<FollowerCardProps> = ({
  followers,
  userId,
}) => {
  const navigateToProfile = useNavigateToUserProfile();
  const navigation = useNavigation();

  const goToFollowersScreen = () => {
    navigation.navigate("FollowersScreen", {userId});
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
        {marginRight: index === followers.length - 1 ? 0 : 15},
      ]}>
      <TouchableOpacity onPress={() => navigateToProfile(followerId)}>
        <Image source={{uri}} style={styles.avatar} />
      </TouchableOpacity>
      <Text style={{color: "#505050"}}>{name}</Text>
    </View>
  );

  return (
    <SharedElement id={`followers.card.${userId}`}>
      <View style={styles.card}>
        <View style={styles.inline}>
          <SharedElement id={`followers.card.${userId}.title`}>
            <Text style={[styles.text, styles.sectionTitle]}>Follower</Text>
          </SharedElement>
          <TouchableOpacity onPress={goToFollowersScreen}>
            <SharedElement id={`followers.card.${userId}.link`}>
              <Text style={[styles.text, styles.link]}>Vedi tutti</Text>
            </SharedElement>
          </TouchableOpacity>
        </View>

        <SharedElement id={`followers.card.${userId}.content`}>
          <ScrollView horizontal style={styles.followers}>
            {followers.map((user, index) =>
              renderAvatar(user.username, user.profileImage, index, user.id),
            )}
          </ScrollView>
        </SharedElement>
      </View>
    </SharedElement>
  );
};

const styles = StyleSheet.create({
  followers: {
    paddingVertical: 10,
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
