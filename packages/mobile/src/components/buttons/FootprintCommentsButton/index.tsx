import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import {abbreviateNumber} from "../../../utils/abbreviateNumber";
import {useNavigation} from "@react-navigation/native";

interface CommentsButtonProps {
  commentsCount: number;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  footprintId: string;
  footprintAuthor: string;
}

export const FootprintCommentsButton: React.FC<CommentsButtonProps> = (
  props,
) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (typeof props.onPress === "function") props.onPress();

    navigation.navigate("CommentsScreen", {
      contentId: props.footprintId,
    });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.wrapper, props.containerStyle]}>
      {props.commentsCount > 0 && (
        <Text style={styles.text}>{abbreviateNumber(props.commentsCount)}</Text>
      )}
      <Icon name="comment-o" color="#fff" size={26} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  text: {
    marginRight: 3,
    color: "#fff",
    fontSize: 12,
  },
});
