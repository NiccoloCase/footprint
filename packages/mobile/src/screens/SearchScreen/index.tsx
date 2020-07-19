import React from "react";
import {View, Text, Button} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {SearchStackParamList, HomeStackParamList} from "../../navigation";
import {store} from "../../store";

type SearchScreenProps = StackScreenProps<
  SearchStackParamList & HomeStackParamList,
  "Search"
>;

export const SearchScreen: React.FC<SearchScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>Impostazioni</Text>
      <Button title="logout" onPress={() => store.getActions().auth.logout()} />
    </View>
  );
};
