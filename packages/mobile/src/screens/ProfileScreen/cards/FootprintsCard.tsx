import React, {useState} from "react";
import {StyleSheet, Image, View} from "react-native";
import Carousel from "react-native-snap-carousel";
import {Card} from "./Card";
import {Spinner} from "../../../components/Spinner";
import {Colors} from "../../../styles";

// Dimenzioni:
const FOOTPRINT_CARD_WIDTH = 150;
const FOOTPRINT_CARD_HEIGHT = 230;

const footprints = [
  "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594926021/static/unnamed_kjegki.png",
  "https://picsum.photos/200",
  "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594926665/static/download_ukbyph.jpg",
  "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594926021/static/unnamed_kjegki.png",
  "https://picsum.photos/200",
  "https://res.cloudinary.com/dgjcj7htv/image/upload/v1594926665/static/download_ukbyph.jpg",
];

export const FootprintsCard: React.FC = () => {
  const [width, setWidth] = useState(0);

  const renderFootprint = ({item, index}: {item: string; index: number}) => (
    <Image
      source={{uri: item}}
      key={index}
      style={styles.footprint}
      resizeMode="cover"
    />
  );

  return (
    <Card title="Footprint" buttonText="Vedi tutti">
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={styles.container}>
        {width ? (
          <Carousel
            style={styles.container}
            data={footprints}
            renderItem={renderFootprint}
            sliderWidth={width}
            itemWidth={FOOTPRINT_CARD_WIDTH}
            centerContent={false}
            activeSlideAlignment="start"
            inactiveSlideScale={0.8}
          />
        ) : (
          <Spinner color={Colors.primary} />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    height: FOOTPRINT_CARD_HEIGHT,
  },
  footprint: {
    height: FOOTPRINT_CARD_HEIGHT,
    borderRadius: 10,
  },
});
