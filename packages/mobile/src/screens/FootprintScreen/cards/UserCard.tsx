import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import {User} from "../../../generated/graphql";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import {Colors} from "../../../styles";
import {useNavigateToUserProfile} from "../../../navigation/navigateToUserProfile";
import {SharedElement} from "react-navigation-shared-element";
import {timeSince} from "../../../utils/format";

interface UserCardProps {
  footprintId: string;
  footprintDate?: Date;
  userData: Partial<Pick<User, "username" | "profileImage" | "id">>;
  height: number;
}

export const UserCard: React.FC<UserCardProps> = ({
  footprintId,
  footprintDate,
  height,
  userData,
}) => {
  const navigateToProfile = useNavigateToUserProfile();

  const {username, profileImage} = userData;

  const goToProfile = () => {
    if (userData.id) navigateToProfile(userData.id);
  };

  return (
    <View style={[styles.container, {height}]}>
      {/** USERNAME-AVATAR*/}
      <View style={styles.user}>
        <TouchableWithoutFeedback onPress={goToProfile}>
          <SharedElement id={`footprint.${footprintId}.profileImage`}>
            <Image style={styles.profilePicture} source={{uri: profileImage}} />
          </SharedElement>
        </TouchableWithoutFeedback>
        <View style={{justifyContent: "space-between"}}>
          <TouchableWithoutFeedback onPress={goToProfile}>
            <SharedElement id={`footprint.${footprintId}.username`}>
              <Text style={[styles.text, styles.username]}>{username}</Text>
            </SharedElement>
          </TouchableWithoutFeedback>
          <SharedElement id={`footprint.${footprintId}.data`}>
            <Text style={[styles.text, {color: "#606060"}]}>
              {footprintDate ? timeSince(footprintDate) : null}
            </Text>
          </SharedElement>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  text: {
    color: Colors.darkGrey,
  },
  user: {
    flexDirection: "row",
    overflow: "hidden",
  },
  profilePicture: {
    width: 45,
    height: 45,
    borderRadius: 10,
    marginRight: 13,
  },
  username: {
    fontWeight: "bold",
    fontSize: 17,
  },
});
