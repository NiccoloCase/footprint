import React, {useEffect} from "react";
import {View, Text, StyleSheet, SafeAreaView} from "react-native";
import {ExploreStackParamList} from "../../navigation";
import {StackScreenProps} from "@react-navigation/stack";
import {MapCard} from "./cards/MapCard";
import {Spacing} from "../../styles";

type FootprintScreenProps = StackScreenProps<
  ExploreStackParamList,
  "Footprint"
>;

export const FootprintScreen: React.FC<FootprintScreenProps> = (props) => {
  const {id, title, authorUsername} = props.route.params;

  useEffect(() => {
    props.navigation.setOptions({title: `${authorUsername}: ${title}`});
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MapCard />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: Spacing.screenHorizontalPadding,
    paddingVertical: 20,
  },
});
