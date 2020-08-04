import React from "react";
import Mapbox from "@react-native-mapbox-gl/maps";
import {Image} from "react-native";
import {HackMarker} from "./HackMarker";

const {PointAnnotation} = Mapbox;

interface MarkerPros {
  coordinate: number[];
  id: string;
  current?: boolean;
  onPress: () => void;
}

export const Marker: React.FC<MarkerPros> = ({
  coordinate,
  id,
  current,
  onPress,
}) => {
  return (
    <PointAnnotation id={id} coordinate={coordinate} onSelected={onPress}>
      <HackMarker>
        <Image
          source={
            current
              ? require("../../assets/images/marker.png")
              : require("../../assets/images/marker-disabled.png")
          }
          style={{
            flex: 1,
            resizeMode: "contain",
            width: 25,
            height: 32,
          }}
        />
      </HackMarker>
    </PointAnnotation>
  );
};
