import React from "react";
import {View, StyleSheet, Text} from "react-native";
import {MapView} from "../../../components/MapView";
import Icon from "react-native-vector-icons/FontAwesome5";
import {Card} from "./Card";
import {getDistanceFromUser} from "../../../utils/geocode";
import {Colors} from "../../../styles";

export const MapCard: React.FC = () => {
  const distance = getDistanceFromUser(23, 32);

  return (
    <Card title="Posizione" buttonText="Espandi">
      <View style={styles.info}>
        <Icon name="map-marker-alt" color={Colors.primary} size={18} />
        <View>
          <Text style={[styles.text, styles.location]} numberOfLines={2}>
            {/* item.locationName || */ "Firenze"}
          </Text>
          {distance && (
            <Text style={[styles.text, styles.distance]} numberOfLines={1}>
              {distance.formattedDistance}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.map}>
        <MapView containerStyle={{borderRadius: 10}} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
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
