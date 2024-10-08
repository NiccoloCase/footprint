import React from "react";
import {View, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {MyProfileDrawerParamList} from "../../navigation";
import {DrawerScreenProps} from "@react-navigation/drawer";

type SettingsScreenProps = DrawerScreenProps<
  MyProfileDrawerParamList,
  "EditProfile"
>;

export const SettingsScreen: React.FC<SettingsScreenProps> = ({navigation}) => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>Impostazioni</Text>
    </View>
  );
};
