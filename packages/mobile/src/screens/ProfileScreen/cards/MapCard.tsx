import React from "react";
import {View, StyleSheet} from "react-native";
import {MapView} from "../../../components/MapView";
import {Card} from "./Card";

export const MapCard: React.FC = () => {
  return (
    <Card title="Mappa" buttonText="Espandi">
      <View style={styles.map}>
        <MapView containerStyle={{borderRadius: 10}} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 400,
    paddingVertical: 10,
  },
});
