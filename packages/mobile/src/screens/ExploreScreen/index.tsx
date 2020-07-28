import React, {useState, useEffect} from "react";
import {StyleSheet, Keyboard} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {ExploreStackParamList, HomeStackParamList} from "../../navigation";
import {SafeAreaView} from "react-native-safe-area-context";
import {ExploreSearchBar} from "./ExploreSearchBar";
import {ExploreCarousel} from "./ExploreCarousel";
import {ExploreMap} from "./ExploreMap";
import {useGetNearFootprintsQuery, Footprint} from "../../generated/graphql";

type ExploreScreenProps = StackScreenProps<
  ExploreStackParamList & HomeStackParamList,
  "Explore"
>;

export interface LocationState {
  coordinates: number[];
  zoom?: number;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({navigation}) => {
  const [location, setLocation] = useState<LocationState>();
  const [showFootprints, setShowFootprints] = useState(false);
  const [currentFootprint, setCurrentFootprint] = useState(0);

  // GRAPHQL
  const {data} = useGetNearFootprintsQuery({
    variables: {lng: 43.770893, lat: 11.252074, maxDistance: 200},
  });
  const footprints = data ? (data.getNearFootprints as Footprint[]) : null;

  const setCurrentFootprintAndFly = (index: number) => {
    if (!footprints) return;
    // imposta il nuovo footprint selezionato
    setCurrentFootprint(index);
    // mostra i footprint se nascosti
    if (!showFootprints) setShowFootprints(true);
    // cambia le coordinate della mappa
    const {coordinates} = footprints[index].location;
    setLocation({coordinates});
  };

  return (
    <SafeAreaView style={styles.container}>
      <ExploreMap
        location={location}
        footprints={footprints}
        currentFootprint={currentFootprint}
        setCurrentFootprint={setCurrentFootprint}
      />
      <ExploreCarousel
        showFootprints={showFootprints}
        setShowFootprints={setShowFootprints}
        footprints={footprints}
        currentFootprint={currentFootprint}
        setCurrentFootprint={setCurrentFootprintAndFly}
      />
      <ExploreSearchBar
        setLocation={setLocation}
        showFootprints={showFootprints}
        setShowFootprints={setShowFootprints}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
