import React from "react";
import {View, StyleSheet, Text} from "react-native";
import {MapView} from "../../../components/map";
import Icon from "react-native-vector-icons/FontAwesome5";
import {Card} from "./Card";
import {getDistanceFromUser} from "../../../utils/geocode";
import {Colors} from "../../../styles";
import {useNavigation} from "@react-navigation/native";

interface MapCardProps {
  location?: {
    coordinates: number[];
    locationName: string;
  };
}

export const MapCard: React.FC<MapCardProps> = ({location}) => {
  const navigation = useNavigation();

  const distance = location
    ? getDistanceFromUser(location.coordinates[1], location.coordinates[0])
    : null;

  const annotations = location
    ? [{coordinates: location.coordinates}]
    : undefined;

  return (
    <Card
      title="Posizione"
      buttonText="Espandi"
      containerStyle={styles.container}
      onButtonPress={() => navigation.navigate("MapScreen", {annotations})}>
      <View style={styles.info}>
        <Icon
          name="map-marker-alt"
          style={styles.icon}
          color={Colors.primary}
          size={25}
        />

        <View>
          <Text
            style={[
              styles.text,
              styles.location,
              !location?.locationName
                ? {
                    backgroundColor: "#ddd",
                    width: 150,
                    borderRadius: 4,
                  }
                : undefined,
            ]}
            numberOfLines={2}>
            {location?.locationName}
          </Text>

          <Text
            style={[
              styles.text,
              styles.distance,
              !distance
                ? {
                    backgroundColor: "#ddd",
                    width: 120,
                    borderRadius: 4,
                  }
                : undefined,
            ]}
            numberOfLines={1}>
            {distance?.formattedDistance}
          </Text>
        </View>
      </View>

      <View style={styles.map}>
        <MapView
          containerStyle={{borderRadius: 10}}
          annotations={annotations}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  info: {
    flexDirection: "row",
    marginVertical: 10,
  },
  map: {
    height: 400,
    paddingVertical: 10,
  },
  text: {
    color: "#707070",
  },
  location: {
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
  icon: {
    alignSelf: "center",
    marginRight: 10,
  },
});
