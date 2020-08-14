import React, {useState} from "react";
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

interface LikeButtonProps {
  onPress?: (isLiked: boolean) => void;
  likesCount?: number;
  containerStyle?: StyleProp<ViewStyle>;
}

export const LikeButton: React.FC<LikeButtonProps> = (props) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(props.likesCount || 0);

  const handlePress = () => {
    // chiama il callback
    if (typeof props.onPress === "function") props.onPress(!isLiked);

    // aggiorna il numero di likes
    setLikesCount(likesCount + (!isLiked ? 1 : -1));

    // aggiorna lo stato del bottone
    setIsLiked(!isLiked);
  };

  return (
    <View style={[styles.wrapper, props.containerStyle]}>
      {likesCount > 0 && (
        <TouchableNativeFeedback>
          <Text style={styles.text}>{abbreviateNumber(likesCount)}</Text>
        </TouchableNativeFeedback>
      )}
      <TouchableOpacity style={styles.button} onPress={handlePress}>
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
  button: {},
});
