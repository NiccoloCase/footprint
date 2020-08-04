import React from "react";
import {Image} from "react-native";
import Mapbox from "@react-native-mapbox-gl/maps";
import {HackMarker} from "./HackMarker";

const {PointAnnotation} = Mapbox;

interface UserHomeMarkerProps {
  coordinates: number[];
}

export const UserHomeMarker: React.FC<UserHomeMarkerProps> = ({
  coordinates,
}) => {
  return (
    <PointAnnotation id="user-home" coordinate={coordinates}>
      <HackMarker>
        <Image
          source={require("../../assets/images/home-marker.png")}
          style={{
            flex: 1,
            resizeMode: "stretch",
            width: 25,
            height: 25,
          }}
        />
      </HackMarker>
    </PointAnnotation>
  );
};
