import React from "react";
import {StyleProp, ViewStyle} from "react-native";
import {Marker} from "./Marker";
import Mapbox from "@react-native-mapbox-gl/maps";
import {calculateCenter} from "../../utils/geocode";
import {UserHomeMarker} from "./UserHomeMarker";

const {MapView: Map, Camera, UserLocation} = Mapbox;

interface MapViewProps {
  containerStyle?: StyleProp<ViewStyle>;
  annotations?: {coordinates: number[]}[];
  userHome?: number[];
}

export const MapView: React.FC<MapViewProps> = ({
  containerStyle,
  annotations,
  userHome,
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
      : userHome;

  return (
    <Map
      style={[{flex: 1}, containerStyle]}
      styleURL={Mapbox.StyleURL.Light}
      compassEnabled={false}>
      <Camera zoomLevel={8} centerCoordinate={centerCoordinate} />
      <UserLocation />
      {userHome && <UserHomeMarker coordinates={userHome} />}
      {renderAnnotations()}
    </Map>
  );
};
