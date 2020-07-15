import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  TouchableNativeFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import EntypoIcon from "react-native-vector-icons/Entypo";
import {LikeButton} from "../../components/buttons";
import {useNavigation, NavigationProp} from "@react-navigation/native";
import {HomeStackParamList} from "../../navigation";

interface FootprintCardProps {
  feedId: string;
  footprintId: string;
  title: string;
  image: string;
  username: string;
  profilePicture: string;
  likesCount?: number;
}

export const FootprintCard: React.FC<FootprintCardProps> = ({
  feedId,
  footprintId,
  title,
  image,
  profilePicture,
  username,
  likesCount,
}) => {
  const navigation = useNavigation<
    NavigationProp<HomeStackParamList, "Home">
  >();

  const goToFootprint = () => {
    navigation.navigate("Footprint", {
      title,
      id: footprintId,
      authorUsername: username,
    });
  };

  return (
    <ImageBackground
      style={styles.container}
      imageStyle={styles.image}
      source={{uri: image}}>
      <View style={styles.contentWrapper}>
        <View style={styles.overlay} />
        <View style={styles.header}>
          {/** USERNAME */}
          <TouchableNativeFeedback
            onPress={() => navigation.navigate("Profile" as any)}>
            <View style={styles.inline}>
              <Image
                style={styles.profilePicture}
                source={{uri: profilePicture}}
              />
              <Text style={[styles.text, {marginLeft: 8}]}>{username}</Text>
            </View>
          </TouchableNativeFeedback>

          {/** POSIZIONE */}
          <View style={styles.inline}>
            <EntypoIcon name="location-pin" color="#fff" size={15} />
            <Text style={[styles.text, {marginLeft: 3}]} numberOfLines={1}>
              City of Florence, Italy
            </Text>
          </View>
        </View>

        {/** TITOLO */}
        <Text style={styles.title} numberOfLines={3}>
          {title}
        </Text>

        {/** Bottone per andare al footprint */}
        <View style={styles.footer}>
          <View style={styles.heroButtonWrapper}>
            <TouchableOpacity style={styles.heroButton} onPress={goToFootprint}>
              <Text style={styles.heroButtonText}>Esplora</Text>
              <Icon name="chevron-right" color="#fff" size={15} />
            </TouchableOpacity>
          </View>
          <View style={styles.inline}>
            {/** LIKE BUTTON  */}
            <LikeButton
              likesCount={likesCount}
              containerStyle={{marginRight: 6}}
            />
            {/** MORE BUTTON */}
            <EntypoIcon name="dots-three-vertical" color="#fff" size={20} />
          </View>
        </View>
      </View>
    </ImageBackground>
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
  },
  contentWrapper: {
    height: "40%",
    paddingHorizontal: 15,
    paddingVertical: 20,
    justifyContent: "space-between",
  },
  overlay: {
    backgroundColor: "#000",
    opacity: 0.3,
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 25,
    height: 25,
    borderRadius: 25 / 2,
  },
  title: {
    color: "#fff",
    fontSize: 23,
    width: "90%",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroButtonWrapper: {
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  heroButton: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  heroButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    marginRight: 10,
  },
  likeButton: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
