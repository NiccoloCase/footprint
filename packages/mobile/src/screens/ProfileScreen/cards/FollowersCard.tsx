import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import {Card} from "./Card";
import {User} from "../../../generated/graphql";

const AVATAR_RADIUS = 32;

interface FollowerCardProps {
  followers: User[];
}

export const FollowerCard: React.FC<FollowerCardProps> = ({followers}) => {
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
