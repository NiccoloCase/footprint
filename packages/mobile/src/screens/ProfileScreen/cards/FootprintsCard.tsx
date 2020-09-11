import React, {useState} from "react";
import {StyleSheet, Image, View, TouchableOpacity, Text} from "react-native";
import Carousel from "react-native-snap-carousel";
import {Card} from "./Card";
import {Spinner} from "../../../components/Spinner";
import {Colors} from "../../../styles";
import {Footprint, Location} from "../../../generated/graphql";
import {useNavigation} from "@react-navigation/native";
import {SharedElement} from "react-navigation-shared-element";

// Dimenzioni:
const FOOTPRINT_CARD_WIDTH = 150;
const FOOTPRINT_CARD_HEIGHT = 230;

type FootprintRequiredFields = Pick<
  Footprint,
  "id" | "title" | "body" | "media" | "author"
> & {
  location: Pick<Location, "coordinates" | "locationName">;
};

interface FootprintCardProps {
  footprints?: Array<FootprintRequiredFields>;
}

export const FootprintsCard: React.FC<FootprintCardProps> = ({footprints}) => {
  const [width, setWidth] = useState(0);

  const navigation = useNavigation();

  const handlePress = (index: number) => () => {
    if (!footprints) return;

    const {id, title, media, author} = footprints[index];

    navigation.navigate("Footprint", {
      id,
      title,
      image: media,
      authorUsername: author.username,
      authorProfileImage: author.profileImage,
    });
  };

  const renderFootprint = ({
    item,
    index,
  }: {
    item: FootprintRequiredFields;
    index: number;
  }) => (
    <TouchableOpacity onPress={handlePress(index)}>
      <SharedElement id={`footprint.${item.id}.image`}>
        {item.media && (
          <Image
            source={{uri: item.media}}
            key={index}
            style={styles.footprint}
            resizeMode="cover"
          />
        )}
      </SharedElement>
    </TouchableOpacity>
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
          inactiveSlideOpacity={1}
        />
      );
    if (footprints && footprints.length === 0)
      return (
        <Text style={styles.msg}>
          L'utente non ha postato ancora nessun footprint
        </Text>
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
    marginTop: 10,
    height: FOOTPRINT_CARD_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  footprint: {
    height: FOOTPRINT_CARD_HEIGHT,
    borderRadius: 10,
  },
  msg: {
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.mediumGrey,
    fontSize: 18,
  },
});
