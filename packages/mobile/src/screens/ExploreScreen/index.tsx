import React, {useState, useEffect} from "react";
import {StyleSheet, Keyboard} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {SearchStackParamList, HomeStackParamList} from "../../navigation";
import {SafeAreaView} from "react-native-safe-area-context";
import {ExploreSearchBar} from "./ExploreSearchBar";
import {ExploreCarousel} from "./ExploreCarousel";
import {ExploreMap} from "./ExploreMap";

type ExploreScreenProps = StackScreenProps<
  SearchStackParamList & HomeStackParamList,
  "Explore"
>;

const footprints = [
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

export interface LocationState {
  coordinates: number[];
  zoom?: number;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({navigation}) => {
  const [location, setLocation] = useState<LocationState>();
  const [showFootprints, setShowFootprints] = useState(false);
  const [currentFootprint, setCurrentFootprint] = useState(0);

  const setCurrentFootprintAndFly = (index: number) => {
    // imposta il nuovo footprint selezionato
    setCurrentFootprint(index);
    // mostra i footprint se nascosti
    if (!showFootprints) setShowFootprints(true);
    // cambia le coordinate della mappa
    const {coordinates} = footprints[index];
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
