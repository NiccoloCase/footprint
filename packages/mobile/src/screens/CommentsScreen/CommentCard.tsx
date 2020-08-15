import React, {useEffect} from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import {User, Comment} from "../../generated/graphql";
import {timeSince} from "../../utils/format";
import {Spacing, Colors} from "../../styles";
import Animated, {
  interpolate,
  timing,
  Easing,
  Extrapolate,
} from "react-native-reanimated";
import {useValue} from "react-native-redash";

const AVATAR_RADIUS = 25;

interface CommentProps {
  comment: Pick<Comment, "text" | "id" | "createdAt"> & {
    author: Pick<User, "id" | "username" | "profileImage">;
  };
  own: boolean;
  deleteCommentCallback: (id: string) => void;
}

export const CommentCard: React.FC<CommentProps> = ({
  comment,
  own,
  deleteCommentCallback,
}) => {
  const {width} = useWindowDimensions();

  // Animazione:
  const animatedValue = useValue(0);

  const translateX = interpolate(animatedValue, {
    inputRange: [0, 0.5, 1],
    outputRange: [-width, 0, width],
    extrapolate: Extrapolate.CLAMP,
  });

  const opacity = interpolate(animatedValue, {
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  useEffect(() => {
    timing(animatedValue, {
      toValue: 0.5,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start();
  }, []);

  const deleteComment = () => {
    timing(animatedValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    }).start(() => deleteCommentCallback(comment.id));
  };

  return (
    <Animated.View
      style={[styles.commentWrapper, {transform: [{translateX}], opacity}]}>
      <View style={styles.inline}>
        <View style={styles.avatarWrapper}>
          <Image
            source={{uri: comment.author.profileImage}}
            style={styles.avatar}
          />
        </View>
        <View style={{flex: 1}}>
          <View style={styles.inline}>
            <Text style={styles.commentAuthor}>{comment.author.username}</Text>
            <Text style={styles.createdAt}>{timeSince(comment.createdAt)}</Text>
          </View>
          <Text style={styles.commentBody}>{comment.text}</Text>
        </View>
      </View>
      <View style={[styles.commentFooter, styles.inline]}>
        {own && (
          <TouchableOpacity onPress={deleteComment}>
            <Text style={styles.deleteComment}>Elimina</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingVertical: 15,
  },
  text: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 25,
    textAlign: "center",
  },
  card: {
    height: "100%",
    backgroundColor: "#eee",
    overflow: "hidden",
    borderRadius: 10,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 4,
  },
  content: {
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    color: Colors.darkGrey,
    fontWeight: "bold",
    fontSize: 24,
  },
  inputBox: {
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  textInput: {
    flex: 1,
    fontSize: 17,
    padding: 0,
    color: Colors.darkGrey,
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentWrapper: {
    backgroundColor: "#fff",
    marginBottom: 15,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  avatarWrapper: {
    marginRight: 15,
    width: AVATAR_RADIUS * 2,
    height: AVATAR_RADIUS * 2,
    borderRadius: AVATAR_RADIUS,
    overflow: "hidden",
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  commentAuthor: {
    flex: 1,
    color: Colors.darkGrey,
    fontSize: 17,
    fontWeight: "bold",
  },
  createdAt: {
    color: "#606060",
    fontSize: 14,
  },
  commentBody: {
    color: "#909090",
    fontSize: 17,
  },
  deleteComment: {
    fontSize: 15,
    color: Colors.errorRed,
  },
  commentFooter: {
    marginTop: 7,
    justifyContent: "flex-end",
  },
});
