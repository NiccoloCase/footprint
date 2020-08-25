import React, {useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import {LikeButton} from "../../components/buttons";
import {useNavigation} from "@react-navigation/native";
import {SharedElement} from "react-navigation-shared-element";
import {useNavigateToUserProfile} from "../../navigation/navigateToUserProfile";

interface FootprintCardProps {
  current: boolean;
  feedId: string;
  footprintId: string;
  title: string;
  image: string;
  username: string;
  authorId: string;
  profilePicture: string;
  locationName: string;
  likesCount?: number;
}

export const FootprintCard: React.FC<FootprintCardProps> = ({
  current,
  footprintId,
  title,
  image,
  profilePicture,
  authorId,
  username,
  locationName,
  likesCount,
}) => {
  const [opacity, setOpacity] = useState(1);
  const navigateToProfile = useNavigateToUserProfile();
  const navigation = useNavigation();

  useEffect(() => {
    const removeOnFocus = navigation.addListener("focus", () => setOpacity(1));
    const removeOnBlur = navigation.addListener("blur", () => {
      if (current) setOpacity(0);
    });
    return () => {
      removeOnFocus();
      removeOnBlur();
    };
  }, [navigation]);

  const goToFootprint = () => {
    navigation.navigate("Footprint", {
      title,
      image,
      id: footprintId,
      authorUsername: username,
      authorProfileImage: profilePicture,
    });
  };

  return (
    <View style={{opacity}}>
      <TouchableWithoutFeedback onPress={goToFootprint}>
        <SharedElement id={`footprint.${footprintId}.image`}>
          <Image style={styles.image} source={{uri: image}} />
        </SharedElement>
      </TouchableWithoutFeedback>

      <View style={styles.contentWrapper}>
        <View style={styles.overlay} />
        <View style={styles.header}>
          {/** POSIZIONE */}
          <View style={styles.inline}>
            <EntypoIcon name="location-pin" color="#fff" size={15} />
            <Text style={[styles.text, {marginLeft: 3}]} numberOfLines={1}>
              {locationName}
            </Text>
          </View>
        </View>

        {/** TITOLO */}
        <SharedElement id={`footprint.${footprintId}.title`}>
          <Text style={styles.title} numberOfLines={3}>
            {title}
          </Text>
        </SharedElement>

        {/** USERNAME*/}
        <View style={styles.footer}>
          <View style={styles.user}>
            <TouchableWithoutFeedback
              onPress={() => navigateToProfile(authorId)}>
              <SharedElement id={`footprint.${footprintId}.profileImage`}>
                <Image
                  style={styles.profilePicture}
                  source={{uri: profilePicture}}
                />
              </SharedElement>
            </TouchableWithoutFeedback>
            <View style={{justifyContent: "space-between"}}>
              <TouchableWithoutFeedback
                onPress={() => navigateToProfile(authorId)}>
                <SharedElement id={`footprint.${footprintId}.username`}>
                  <Text style={[styles.text, styles.username]}>{username}</Text>
                </SharedElement>
              </TouchableWithoutFeedback>
              <SharedElement id={`footprint.${footprintId}.data`}>
                <Text style={[styles.text, {color: "#ddd"}]}>34 min fa</Text>
              </SharedElement>
            </View>
          </View>

          {/** LIKE BUTTON  */}
          <LikeButton
            likesCount={likesCount}
            containerStyle={{marginRight: 6}}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  image: {
    resizeMode: "cover",
    borderRadius: 10,

    // container:

    width: "100%",
    height: "100%",

    justifyContent: "flex-end",
  },
  contentWrapper: {
    position: "absolute",
    width: "100%",
    height: "40%",
    bottom: 0,
    paddingHorizontal: 15,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  overlay: {
    backgroundColor: "#000",
    opacity: 0.35,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    borderRadius: 10,
  },
  text: {
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 23,
    width: "90%",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  user: {
    flex: 1,
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
  likeButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
