import React, {useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import Animated, {
  interpolate,
  Extrapolate,
  color,
} from "react-native-reanimated";
import {useValue, useTimingTransition} from "react-native-redash";
import Icon from "react-native-vector-icons/FontAwesome5";
import {AppStackParamList} from "../../navigation";
import {StackScreenProps} from "@react-navigation/stack";
import {SharedElement} from "react-navigation-shared-element";
import {useGetFootprintsByIdQuery} from "../../generated/graphql";
import {Spacing} from "../../styles";

// Cards
import {UserCard} from "./cards/UserCard";
import {LikesCard} from "./cards/LikesCard";
import {MapCard} from "./cards/MapCard";
import {CommentsCard} from "./cards/CommentsCard";

// Dimensioni:
const {height} = Dimensions.get("window");
const USER_CARD_HEIGHT = 75;
const IMAGE_HEIGHT = height - USER_CARD_HEIGHT - (StatusBar.currentHeight || 0);
const HEADER_HEIGHT = 55;
const CLOSE_BUTTON_RADIUS = 30;

type FootprintScreenProps = StackScreenProps<AppStackParamList, "Footprint">;

export const FootprintScreen: React.FC<FootprintScreenProps> = ({
  route,
  navigation,
}) => {
  // Se mostare il titolo sipra l'immagine
  const [showImageContent, setShowImageContent] = useState(true);

  const {id, image, authorProfileImage, authorUsername, title} = route.params;

  // Graphql
  const {data} = useGetFootprintsByIdQuery({variables: {id}});

  // Animazione:
  const y = useValue<number>(0);
  const titleOpacity = useTimingTransition(showImageContent);
  const headerOpacity = interpolate(y, {
    inputRange: [
      IMAGE_HEIGHT - HEADER_HEIGHT - 25,
      IMAGE_HEIGHT - HEADER_HEIGHT + 25,
    ],
    outputRange: [0, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#303030" barStyle="light-content" />
      <ScrollView
        style={styles.scrollView}
        onScroll={(e) => y.setValue(e.nativeEvent.contentOffset.y)}>
        {/** IMMAGINE */}
        <TouchableWithoutFeedback
          onPressIn={() => setShowImageContent(false)}
          onPressOut={() => setShowImageContent(true)}>
          <View style={styles.imageContainer}>
            <SharedElement id={`footprint.${id}.image`}>
              <Image style={styles.image} source={{uri: image}} />
            </SharedElement>
            {/** TITOLO */}
            <Animated.View
              style={[styles.titleWrapper, {opacity: titleOpacity}]}>
              <SharedElement id={`footprint.${id}.title`}>
                <Text style={styles.title}>{title}</Text>
              </SharedElement>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        {/** CONTENUTO */}
        <SafeAreaView style={styles.content}>
          {/** AUTORE */}
          <UserCard
            footprintId={id}
            height={USER_CARD_HEIGHT}
            userData={
              data
                ? data.getFootprintById.author
                : {
                    username: authorUsername,
                    profileImage: authorProfileImage,
                  }
            }
          />
          {/** LIKES */}
          <LikesCard
            footprintId={id}
            likesCount={100}
            likes={[
              {
                username: "nicco",
                profileImage: authorProfileImage,
                id: "1pid+pdoo",
              },
            ]}
          />
          {/** COMMENTI */}
          <CommentsCard footprintId={id} commentsCount={10} />

          {/** MAPPA */}
          {/* <MapCard location={data?.getFootprintById.location} /> */}
        </SafeAreaView>
      </ScrollView>

      {/** HEADER */}
      <Animated.View
        style={[
          styles.header,
          {backgroundColor: color(48, 48, 48, headerOpacity)},
        ]}>
        <Animated.Text
          style={[styles.headerTitle, {opacity: headerOpacity}]}
          numberOfLines={1}>
          {title}
        </Animated.Text>
        <TouchableOpacity
          onPress={() => {}}
          style={[styles.headerButton, {marginRight: 10}]}>
          <Icon name="share-alt" color="#eee" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={goBack} style={styles.headerButton}>
          <Icon name="times" color="#eee" size={23} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

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
});
