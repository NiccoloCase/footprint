import React from "react";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableNativeFeedback,
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
    <View style={[styles.wrapper, props.containerStyle]}>
      {props.likesCount > 0 && (
        <TouchableNativeFeedback>
          <Text style={styles.text}>{abbreviateNumber(props.likesCount)}</Text>
        </TouchableNativeFeedback>
      )}
      <TouchableOpacity onPress={handlePress}>
        <AntDesignIcon
          name={isLiked ? "heart" : "hearto"}
          color="#fff"
          size={26}
        />
      </TouchableOpacity>
    </View>
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
