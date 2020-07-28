import React, {useRef, useEffect} from "react";
import {StyleProp, ViewStyle, PermissionsAndroid} from "react-native";
import Mapbox from "@react-native-mapbox-gl/maps";
import {Marker} from "../../components/map";
import {LocationState} from ".";
import {Footprint} from "../../generated/graphql";

// 11.255814, 43.769562 --> frienze

const {MapView, Camera, UserLocation} = Mapbox;

interface ExploreMapProps {
  containerStyle?: StyleProp<ViewStyle>;
  location?: LocationState;
  footprints: Footprint[] | null;
  currentFootprint: number;
  setCurrentFootprint: (index: number) => void;
}

export const ExploreMap: React.FC<ExploreMapProps> = ({
  containerStyle,
  location,
  footprints,
  currentFootprint,
  setCurrentFootprint,
}) => {
  const camera = useRef<Mapbox.Camera>();

  useEffect(() => {
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
  }, []);

  useEffect(() => {
    if (!location || !camera.current) return;

    const animationDuration = 500;

    // muove la mappa e esegue uno zoom
    if (location.zoom)
      camera.current.setCamera({
        centerCoordinate: location.coordinates,
        zoomLevel: location.zoom,
        animationDuration,
      });
    // muove e basta
    else camera.current.flyTo(location.coordinates, animationDuration);
  }, [location]);

  const renderAnnotations = () => {
    if (!footprints) return;
    return footprints.map((footprint, index) => {
      const current = currentFootprint === index;
      const id = `pointAnnotation${index}${current ? "-current" : ""}`;
      const {coordinates} = footprint.location;

      const onPress = () => {
        if (current) return;
        setCurrentFootprint(index);
      };

      return (
        <Marker
          coordinate={coordinates}
          id={id}
          key={id}
          current={current}
          onPress={onPress}
        />
      );
    });
  };

  const centerCoordinate = footprints
    ? footprints[0].location.coordinates
    : [11.255814, 43.769562];

  return (
    <MapView
      style={[{flex: 1}, containerStyle]}
      styleURL={Mapbox.StyleURL.Light}
      compassEnabled={false}>
      <Camera
        ref={camera as any}
        zoomLevel={5 /** TODO */}
        centerCoordinate={centerCoordinate}
      />
      <UserLocation />
      {renderAnnotations()}
    </MapView>
  );
};
