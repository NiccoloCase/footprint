import React from "react";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import {abbreviateNumber} from "../../../utils/abbreviateNumber";
import {useFootprintLikes} from "../../../utils/hooks";

interface LikeButtonProps {
  onPress?: (isLiked: boolean) => void;
  isLiked?: boolean;
  likesCount: number;
  containerStyle?: StyleProp<ViewStyle>;
  footprintId: string;
  footprintAuthor: string;
}

export const FootprintLikeButton: React.FC<LikeButtonProps> = (props) => {
  const [isLiked, handlePress] = useFootprintLikes(
    props.footprintId,
    props.footprintAuthor,
    props.isLiked,
  );

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.wrapper, props.containerStyle]}>
      {props.likesCount > 0 && (
        <Text style={styles.text}>{abbreviateNumber(props.likesCount)}</Text>
      )}
      <AntDesignIcon
        name={isLiked ? "heart" : "hearto"}
        color="#fff"
        size={26}
      />
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
