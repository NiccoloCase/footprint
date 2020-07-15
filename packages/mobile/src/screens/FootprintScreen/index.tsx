import React, {useEffect} from "react";
import {View, Text} from "react-native";
import {HomeStackParamList} from "../../navigation";
import {StackScreenProps} from "@react-navigation/stack";

type FootprintScreenProps = StackScreenProps<HomeStackParamList, "Footprint">;

export const FootprintScreen: React.FC<FootprintScreenProps> = (props) => {
  const {id, title, authorUsername} = props.route.params;

  useEffect(() => {
    props.navigation.setOptions({title: `${authorUsername}: ${title}`});
  }, []);

  return (
    <View style={{}}>
      <Text>ID: {id}</Text>
      <Text>TITLE: </Text>
    </View>
  );
};
