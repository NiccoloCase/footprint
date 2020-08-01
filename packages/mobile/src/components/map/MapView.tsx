import React from "react";
import {StyleProp, ViewStyle} from "react-native";
import {Marker} from "./Marker";
import Mapbox from "@react-native-mapbox-gl/maps";
import {calculateCenter} from "../../utils/geocode";

const {MapView: Map, Camera, UserLocation} = Mapbox;

interface MapViewProps {
  containerStyle?: StyleProp<ViewStyle>;
  annotations?: {coordinates: number[]}[];
}

export const MapView: React.FC<MapViewProps> = ({
  containerStyle,
  annotations,
}) => {
  const renderAnnotations = () => {
    if (!annotations) return;
    return annotations.map((annotation, index) => {
      const id = `pointAnnotation${index}`;
      const {coordinates} = annotation;

      return (
        <Marker
          coordinate={coordinates}
          id={id}
          key={id}
          current={true}
          onPress={() => {}}
        />
      );
    });
  };

  const centerCoordinate =
    annotations && annotations.length > 0
      ? calculateCenter(annotations.map((a) => a.coordinates))
      : [11.255814, 43.769562]; // TODO: user home

  return (
    <Map
      style={[{flex: 1}, containerStyle]}
      styleURL={Mapbox.StyleURL.Light}
      compassEnabled={false}>
      <Camera zoomLevel={8} centerCoordinate={centerCoordinate} />
      <UserLocation />
      {renderAnnotations()}
    </Map>
  );
};
