import {StyleSheet, Dimensions, StatusBar} from "react-native";
import {Spacing} from "../../styles";

// Dimensioni:
const {height} = Dimensions.get("window");
export const USER_CARD_HEIGHT = 75;
export const IMAGE_HEIGHT =
  height - USER_CARD_HEIGHT - (StatusBar.currentHeight || 0);
export const HEADER_HEIGHT = 55;
export const CLOSE_BUTTON_RADIUS = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {},
  imageContainer: {
    height: IMAGE_HEIGHT,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    borderBottomRightRadius: 12,
    borderBottomLeftRadius: 12,
  },
  headerButton: {
    backgroundColor: "rgba(0,0,0,0.15)",
    width: CLOSE_BUTTON_RADIUS,
    height: CLOSE_BUTTON_RADIUS,
    borderRadius: CLOSE_BUTTON_RADIUS / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    marginLeft: CLOSE_BUTTON_RADIUS + 15,
    marginRight: 15,
    textAlign: "center",
  },
  titleWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    paddingVertical: 35,
    paddingHorizontal: 15,
  },
  title: {
    color: "#fefefe",
    fontWeight: "bold",
    fontSize: 29,
    textAlignVertical: "bottom",
    textShadowColor: "rgba(0, 0, 0, 0.65)",
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 9,
  },
  content: {
    paddingHorizontal: Spacing.screenHorizontalPadding,
  },
  descriptionWrapper: {marginTop: 5},
  description: {
    color: "#5f6368",
    fontSize: 16,
  },
});

export default styles;
