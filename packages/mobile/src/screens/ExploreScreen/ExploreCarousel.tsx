import React, {useEffect, useRef} from "react";
import Carousel from "react-native-snap-carousel";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import {Colors} from "../../styles";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import Icon from "react-native-vector-icons/FontAwesome5";
import Animated, {Easing} from "react-native-reanimated";
import {useTimingTransition, mix} from "react-native-redash";
import {Footprint} from "../../generated/graphql";
import {getDistanceFromUser} from "../../utils/geocode";
import {useNavigation} from "@react-navigation/native";
import {TouchableWithoutFeedback} from "react-native-gesture-handler";
import {SharedElement} from "react-navigation-shared-element";

// Dimenzioni
const {width} = Dimensions.get("window");
const CARD_WIDTH = (width * 70) / 100;
const CARD_HEIGHT = 260;

const INITIAL_INDEX = 0;

interface ExploreCarouselProps {
  showFootprints: boolean;
  setShowFootprints: (vale: boolean) => void;
  footprints?: Footprint[];
  setCurrentFootprint: (index: number) => void;
  currentFootprint: number;
}

export const ExploreCarousel: React.FC<ExploreCarouselProps> = ({
  showFootprints,
  setShowFootprints,
  footprints,
  setCurrentFootprint,
  currentFootprint,
}) => {
  const carouselRef = useRef<Carousel<any> | null>(null);
  const navigation = useNavigation();

  // Animazione per nascondere / mostrare i footprint
  const tranistion = useTimingTransition(showFootprints, {
    duration: 200,
    easing: Easing.inOut(Easing.ease),
  });
  const translateY = mix(tranistion, CARD_HEIGHT + 50, 0);

  useEffect(() => {
    onSnapToItem(INITIAL_INDEX);
    setShowFootprints(true);
  }, []);

  useEffect(() => setShowFootprints(!!footprints), [footprints]);

  useEffect(() => {
    if (
      carouselRef.current &&
      carouselRef.current.currentIndex !== currentFootprint
    ) {
      carouselRef.current.snapToItem(currentFootprint);
    }
  }, [currentFootprint]);

  const onSnapToItem = (index: number) => {
    setCurrentFootprint(index);
  };

  /**
   * Porta l'utente alla schermata del footprint
   * @param index
   */
  const goToFootprint = (index: number) => () => {
    if (footprints && footprints.length > 0) {
      const {id, title, author, media} = footprints[index];

      navigation.navigate("Footprint", {
        id,
        title,
        image: media,
        authorUsername: author.username,
        authorProfileImage: author.profileImage,
      });
    }
  };

  const renderItem = ({item, index}: {item: Footprint; index: number}) => {
    const {coordinates} = item.location;

    const distance = getDistanceFromUser(coordinates[1], coordinates[0]);

    return (
      <Animated.View
        style={[styles.card, {transform: [{translateY}], opacity: tranistion}]}
        key={index}>
        <TouchableWithoutFeedback onPress={goToFootprint(index)}>
          <SharedElement id={`footprint.${item.id}.image`}>
            {item.media && (
              <Image source={{uri: item.media}} style={styles.cardImage} />
            )}
          </SharedElement>
        </TouchableWithoutFeedback>
        <View style={styles.content}>
          <View style={styles.contentWrapper}>
            <SharedElement id={`footprint.${item.id}.username`}>
              <Text style={[styles.text, styles.username]} numberOfLines={1}>
                {item.author.username}
              </Text>
            </SharedElement>
            <SharedElement id={`footprint.${item.id}.title`}>
              <Text style={[styles.text, styles.title]} numberOfLines={4}>
                {item.title}
              </Text>
            </SharedElement>
            <View style={{flexDirection: "row"}}>
              <Icon name="map-marker-alt" color={Colors.primary} size={18} />
              <View>
                <Text style={[styles.text, styles.location]} numberOfLines={2}>
                  {item.location.locationName}
                </Text>
                {distance && (
                  <Text
                    style={[styles.text, styles.distance]}
                    numberOfLines={1}>
                    {distance.formattedDistance}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        initialScrollIndex={INITIAL_INDEX}
        data={footprints || []}
        renderItem={renderItem}
        sliderWidth={width}
        itemWidth={CARD_WIDTH}
        inactiveSlideScale={0.85}
        inactiveSlideOpacity={1}
        onSnapToItem={onSnapToItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 15,
  },
  card: {
    flexDirection: "row",
  },

  cardImage: {
    borderRadius: 10,
    width: 150,
    height: CARD_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
    marginVertical: 15,
    paddingHorizontal: 7,
    paddingVertical: 10,
    overflow: "hidden",

    // ombra:
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  text: {
    color: "#707070",
  },
  username: {
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.darkGrey,
  },
  location: {
    marginLeft: 5,
    marginBottom: 5,
  },
  distance: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  inline: {
    flexDirection: "row",
    alignItems: "center",
  },
});
