import React, {useState} from "react";
import {StyleSheet, Image, View} from "react-native";
import Carousel from "react-native-snap-carousel";
import {Card} from "./Card";
import {Spinner} from "../../../components/Spinner";
import {Colors} from "../../../styles";
import {Footprint, Location} from "../../../generated/graphql";

// Dimenzioni:
const FOOTPRINT_CARD_WIDTH = 150;
const FOOTPRINT_CARD_HEIGHT = 230;

type FootprintRequiredFields = Pick<
  Footprint,
  "id" | "title" | "body" | "media"
> & {
  location: Pick<Location, "coordinates" | "locationName">;
};

interface FootprintCardProps {
  footprints?: Array<FootprintRequiredFields>;
}

export const FootprintsCard: React.FC<FootprintCardProps> = ({footprints}) => {
  const [width, setWidth] = useState(0);

  const renderFootprint = ({
    item,
    index,
  }: {
    item: FootprintRequiredFields;
    index: number;
  }) => (
    <Image
      source={{uri: item.media!}}
      key={index}
      style={styles.footprint}
      resizeMode="cover"
    />
  );

  const renderContent = () => {
    if (width && footprints)
      return (
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
      );
    else return <Spinner color={Colors.primary} />;
  };

  return (
    <Card title="Footprint">
      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={styles.container}>
        {renderContent()}
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
