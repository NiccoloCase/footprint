import React from "react";
import {View, StyleSheet} from "react-native";
import {MapView} from "../../../components/map";
import {Card} from "./Card";
import {useGetFootprintsByUserQuery} from "../../../generated/graphql";
import {useNavigation} from "@react-navigation/native";

interface MapCardProps {
  userId: string;
}

export const MapCard: React.FC<MapCardProps> = ({userId}) => {
  const navigation = useNavigation();

  const {data, error, loading} = useGetFootprintsByUserQuery({
    variables: {userId},
  });

  const annotations =
    !error && !loading && data
      ? data.getFootprintsByUser.map((res) => res.location)
      : [];

  const goToMapScreen = () => {
    navigation.navigate("MapScreen", {annotations});
  };

  return (
    <Card
      title="Mappa"
      buttonText={annotations.length > 0 ? "Espandi" : undefined}
      onButtonPress={goToMapScreen}>
      <View style={styles.map}>
        <MapView annotations={annotations} />
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
});
