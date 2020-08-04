import React from "react";
import {View, StyleSheet, Image, Text} from "react-native";
import {MapView} from "../../../components/map";
import {Card} from "./Card";
import {User, Footprint, Location} from "../../../generated/graphql";
import {useNavigation} from "@react-navigation/native";
import {Colors} from "../../../styles";

interface MapCardProps {
  user: User;
  footprints?: Array<
    Pick<Footprint, "id" | "title" | "body" | "media"> & {
      location: {__typename?: "Location"} & Pick<
        Location,
        "coordinates" | "locationName"
      >;
    }
  >;
  loading?: boolean;
}

export const MapCard: React.FC<MapCardProps> = ({
  user,
  loading,
  footprints,
}) => {
  const navigation = useNavigation();

  const annotations =
    !loading && footprints ? footprints.map((res) => res.location) : [];

  const goToMapScreen = () => {
    navigation.navigate("MapScreen", {annotations});
  };

  return (
    <Card
      title="Mappa"
      buttonText={annotations.length > 0 ? "Espandi" : undefined}
      onButtonPress={goToMapScreen}>
      <View style={styles.map}>
        <MapView
          annotations={annotations}
          userHome={user.location.coordinates}
        />
      </View>
      <View style={styles.location}>
        <Image
          source={require("../../../assets/images/home-marker.png")}
          style={styles.locationIcon}
        />
        <Text style={styles.locationText}>{user.location.locationName}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 400,
    paddingVertical: 10,
    overflow: "hidden",
    borderRadius: 20,
  },

  location: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    width: 30,
    height: 30,
  },
  locationText: {
    color: Colors.darkGrey,
    marginLeft: 10,
  },
});
