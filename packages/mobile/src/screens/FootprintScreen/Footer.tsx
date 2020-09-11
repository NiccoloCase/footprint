import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import {User} from "../../generated/graphql";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import {Colors} from "../../styles";
import {useNavigateToUserProfile} from "../../navigation/navigateToUserProfile";
import {SharedElement} from "react-navigation-shared-element";
import {timeSince} from "../../utils/format";
import {abbreviateNumber} from "../../utils/abbreviateNumber";
import {useFootprintLikes} from "../../utils/hooks";
import {useNavigation} from "@react-navigation/native";

const COLOR = "#707070";

interface FooterProps {
  /** ID del footprint */
  footprintId: string;
  /** ID dell'autore del footprint */
  footprintAuthor?: string;
  /** Se l'utente ha già messo like al footprint */
  isAlredyLiked?: boolean;
  /** Data di creazione del footprint */
  footprintDate?: Date;
  /** Informazioni sull'utente */
  userData: Partial<Pick<User, "username" | "profileImage" | "id">>;
  /** Altezza del contenitore */
  height: number;
  /** Numero di likes */
  likesCount?: number;
  commentsCount?: number;
}

export const Footer: React.FC<FooterProps> = ({
  footprintId,
  footprintAuthor,
  isAlredyLiked,
  footprintDate,
  height,
  userData,
  likesCount,
  commentsCount,
}) => {
  // Navigazione
  const navigation = useNavigation();
  const navigateToProfile = useNavigateToUserProfile();

  // Gestione dei likes
  const [isLiked, handleLikeButtonPress] = useFootprintLikes(
    footprintId,
    footprintAuthor,
    isAlredyLiked,
  );

  /**
   * Porta l'utente alla schrmata del profilo
   */
  const goToProfile = () => {
    if (userData.id) navigateToProfile(userData.id);
  };

  /**
   * Porta l'utente alla schermata del commento
   */
  const goToComments = () => {
    navigation.navigate("CommentsScreen", {
      contentId: footprintId,
    });
  };

  const {username, profileImage} = userData;

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
          {/** DATA */}
          <SharedElement id={`footprint.${footprintId}.data`}>
            <Text style={[styles.text, {color: "#606060"}]}>
              {footprintDate ? timeSince(footprintDate) : null}
            </Text>
          </SharedElement>
        </View>
      </View>
      {/** CONTATORI */}
      <SharedElement id={`footprint.${footprintId}.counters`}>
        <View style={styles.buttons}>
          {/** LIKES */}
          <TouchableOpacity
            onPress={handleLikeButtonPress}
            style={styles.button}>
            <AntDesignIcon
              name={isLiked ? "heart" : "hearto"}
              color={isLiked ? Colors.primary : COLOR}
              size={30}
            />
            <Text
              style={[
                styles.counter,
                {
                  opacity: likesCount === undefined ? 0 : 1,
                },
              ]}>
              {!!likesCount ? abbreviateNumber(likesCount) : 0}
            </Text>
          </TouchableOpacity>

          {/** COMMENTI */}
          <TouchableOpacity onPress={goToComments} style={styles.button}>
            <FontAwesomeIcon name="comment-o" color={COLOR} size={30} />
            <Text
              style={[
                styles.counter,
                {
                  opacity: commentsCount === undefined ? 0 : 1,
                },
              ]}>
              {!!commentsCount ? abbreviateNumber(commentsCount) : 0}
            </Text>
          </TouchableOpacity>
        </View>
      </SharedElement>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 20,
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
  buttons: {
    alignItems: "center",
    flexDirection: "row",
  },
  counter: {
    color: COLOR,
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    alignItems: "center",
    marginLeft: 30,
  },
});
