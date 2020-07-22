import React, {useState, useEffect} from "react";
import {View, Text, Button, StyleSheet} from "react-native";
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

export const ExploreScreen: React.FC<ExploreScreenProps> = ({navigation}) => {
  const [cooordinated, setCoordinates] = useState<number[] | null>(null);
  const [showFootprints, setShowFootprints] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ExploreMap flyTo={cooordinated} />
      <ExploreCarousel
        setCoordinates={setCoordinates}
        showFootprints={showFootprints}
        setShowFootprints={setShowFootprints}
      />
      <ExploreSearchBar
        setCoordinates={setCoordinates}
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
