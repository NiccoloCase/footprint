import React, {useEffect} from "react";
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

// Dimenzioni
const {width} = Dimensions.get("window");
const CARD_WIDTH = (width * 70) / 100;
const CARD_HEIGHT = 260;

const INITIAL_INDEX = 0;

const data = [
  {
    title: "Ciao questo è un footprint",
    media: "https://picsum.photos/200/301",
    username: "niccolo",
    locationName: "City of Florence. Italyeee",
    coordinates: [-73.98330688476561, 40.76975180901395],
  },
  {
    title:
      "Ciao questo è un footprint molto molto molot lunghissimomissimo ancora un po di piu e ci siamo",
    media: "https://picsum.photos/200/302",
    username: "niccolo",
    locationName: "City of Florence. Italy",
    coordinates: [-73.96682739257812, 40.761560925502806],
  },
  {
    title: "Ciao",
    media: "https://picsum.photos/200/303",
    username: "niccolo",
    locationName: "City of Florence. Italy",
    coordinates: [-74.00751113891602, 40.746346606483826],
  },
];

interface ExploreCarouselProps {
  setCoordinates: (coords: number[]) => void;
  showFootprints: boolean;
  setShowFootprints: (vale: boolean) => void;
}

export const ExploreCarousel: React.FC<ExploreCarouselProps> = ({
  setCoordinates,
  showFootprints,
  setShowFootprints,
}) => {
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

  const onSnapToItem = (index: number) => {
    setCoordinates(data[index].coordinates);
  };

  const renderItem = ({item, index}: {item: any; index: number}) => (
    <Animated.View
      style={[styles.card, {transform: [{translateY}], opacity: tranistion}]}
      key={index}>
      <Image source={{uri: item.media}} style={styles.cardImage} />

      <View style={styles.content}>
        <View style={styles.contentWrapper}>
          <Text style={[styles.text, styles.username]} numberOfLines={1}>
            {item.username}
          </Text>
          <Text style={[styles.text, styles.title]} numberOfLines={4}>
            {item.title}
          </Text>
          <View style={{flexDirection: "row"}}>
            <Icon name="map-marker-alt" color={Colors.primary} size={18} />
            <View>
              <Text style={[styles.text, styles.location]} numberOfLines={2}>
                {item.locationName}
              </Text>
              <Text style={[styles.text, styles.distance]} numberOfLines={1}>
                30km da te
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.goIcon}>
          <AntDesignIcon name="arrowright" color={Colors.primary} size={28} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        initialScrollIndex={INITIAL_INDEX}
        data={data}
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
    // backgroundColor: "blue",
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
  goIcon: {
    alignSelf: "flex-end",
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
