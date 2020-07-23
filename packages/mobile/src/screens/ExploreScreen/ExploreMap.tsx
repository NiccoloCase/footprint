import React, {useRef, useEffect} from "react";
import {StyleProp, ViewStyle} from "react-native";
import Mapbox from "@react-native-mapbox-gl/maps";
import {Marker} from "../../components/map";
import {LocationState} from ".";
// 11.255814, 43.769562 --> frienze

const {MapView, Camera} = Mapbox;

interface ExploreMapProps {
  containerStyle?: StyleProp<ViewStyle>;
  location?: LocationState;
  footprints: any[];
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

  const renderAnnotations = () =>
    footprints.map((footprint, index) => {
      const current = currentFootprint === index;
      const id = `pointAnnotation${index}${current ? "-current" : ""}`;
      const {coordinates} = footprint;

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

  return (
    <MapView
      style={[{flex: 1}, containerStyle]}
      styleURL={Mapbox.StyleURL.Light}
      compassEnabled={false}>
      <Camera
        ref={camera as any}
        zoomLevel={15}
        centerCoordinate={footprints[0].coordinates}
      />
      {renderAnnotations()}
    </MapView>
  );
};
