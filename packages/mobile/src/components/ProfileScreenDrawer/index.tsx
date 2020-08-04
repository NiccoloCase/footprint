import React from "react";
import {View, StyleSheet, Text} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import {Colors} from "../../styles";
import {logout} from "../../utils/logout";

const BORDER_COLOR = "#eee";
const BORDER_WIDTH = 3;

export const ProfileScreenDrawerContent: React.FC<DrawerContentComponentProps> = (
  props,
) => {
  return (
    <View style={styles.conatiner}>
      <DrawerContentScrollView {...props}>
        <View style={styles.itemsWrapper}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View>
        <View style={styles.logoutBtnWrapper}>
          <DrawerItem
            {...props}
            inactiveTintColor={Colors.darkGrey}
            activeTintColor={Colors.darkGrey}
            onPress={logout}
            icon={({size, color}) => (
              <MaterialCommunityIcon
                name="exit-to-app"
                color={color}
                size={size}
              />
            )}
            label="Esci"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conatiner: {
    flex: 1,
    paddingBottom: 15,
    paddingTop: 30,
  },
  itemsWrapper: {
    borderColor: BORDER_COLOR,
    borderBottomWidth: BORDER_WIDTH,
  },
  logoutBtnWrapper: {
    borderColor: BORDER_COLOR,
    borderTopWidth: BORDER_WIDTH,
    borderBottomWidth: BORDER_WIDTH,
  },
});
