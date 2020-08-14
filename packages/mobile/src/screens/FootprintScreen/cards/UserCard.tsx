import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";
import {User} from "../../../generated/graphql";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import {Colors} from "../../../styles";
import {useNavigateToUserProfile} from "../../../navigation/navigateToUserProfile";
import {SharedElement} from "react-navigation-shared-element";

interface UserCardProps {
  footprintId: string;
  userData: Partial<Pick<User, "username" | "profileImage" | "id">>;
  height: number;
}

export const UserCard: React.FC<UserCardProps> = ({
  footprintId,
  height,
  userData,
}) => {
  const navigateToProfile = useNavigateToUserProfile();

  ////////
  /* const username = "niccolocase";
  const image =
    "https://res.cloudinary.com/dgjcj7htv/image/upload/v1595854452/static/photo-1552752399-22aa8f97ade0_fqkui9.jpg"; */
  ///////////

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
            <Text style={[styles.text, {color: "#606060"}]}>34 min fa</Text>
          </SharedElement>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "green",
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
