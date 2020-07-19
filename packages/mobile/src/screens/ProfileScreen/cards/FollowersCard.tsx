import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {Card} from "./Card";

const followers = [
  {
    username: "nicco",
    profileImage: "https://picsum.photos/200",
  },
  {
    username: "niccocase",
    profileImage:
      "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594926021/static/unnamed_kjegki.png",
  },
  {
    username: "niccolo.caseli",
    profileImage:
      "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594926665/static/download_ukbyph.jpg",
  },

  {
    username: "nicco",
    profileImage: "https://picsum.photos/200",
  },
  {
    username: "niccocase",
    profileImage:
      "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594926021/static/unnamed_kjegki.png",
  },
  {
    username: "niccolo.caseli",
    profileImage:
      "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594926665/static/download_ukbyph.jpg",
  },
];

const AVATAR_RADIUS = 32;

export const FollowerCard: React.FC = () => {
  const renderAvatar = (name: string, uri: string, index: number) => (
    <View
      style={[
        styles.avatarContainer,
        {marginRight: index === followers.length - 1 ? 0 : 15},
      ]}
      key={index}>
      <Image source={{uri}} style={styles.avatar} />
      <Text style={{color: "#505050"}}>{name}</Text>
    </View>
  );

  return (
    <Card title="Follower" buttonText="Vedi tutti">
      <ScrollView horizontal style={styles.followers}>
        {followers.map((user, index) =>
          renderAvatar(user.username, user.profileImage, index),
        )}
      </ScrollView>
    </Card>
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
});
