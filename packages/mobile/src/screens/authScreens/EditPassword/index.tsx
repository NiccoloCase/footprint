import React from "react";
import {View, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {
  MyProfileDrawerParamList,
  EditProfileStackParamList,
} from "../../../navigation";
import {DrawerScreenProps} from "@react-navigation/drawer";

type EditPasswordScreenProps = DrawerScreenProps<
  MyProfileDrawerParamList,
  "EditProfile"
> &
  StackScreenProps<EditProfileStackParamList, "EditPassword">;

export const EditPasswordScreen: React.FC<EditPasswordScreenProps> = ({
  navigation,
}) => {
  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>Impostazioni</Text>
    </View>
  );
};
