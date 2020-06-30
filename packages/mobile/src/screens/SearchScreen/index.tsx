import React from "react";
import {View, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {SearchStackParamList, HomeStackParamList} from "../../navigation";

type SearchScreenProps = StackScreenProps<
  SearchStackParamList & HomeStackParamList,
  "Search"
>;

export const SearchScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>Impostazioni</Text>
    </View>
  );
};
