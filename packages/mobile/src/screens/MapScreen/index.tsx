import React from "react";
import {MapView} from "../../components/map";
import {StyleSheet, View, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import {StackScreenProps} from "@react-navigation/stack";
import {AppStackParamList} from "../../navigation";

type MapScreenProps = StackScreenProps<AppStackParamList, "MapScreen">;

export const MapScreen: React.FC<MapScreenProps> = ({route, navigation}) => {
  const {annotations} = route.params;

  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <MapView annotations={annotations} />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.closeBtn}>
          <Icon name="times" color="#eee" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 10,
  },
  closeBtn: {
    backgroundColor: "rgba(0,0,0,0.2)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
