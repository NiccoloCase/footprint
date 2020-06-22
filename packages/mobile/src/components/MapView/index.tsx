import React from 'react';
import {View, Text, Image} from 'react-native';
import Mapbox from '@react-native-mapbox-gl/maps';

const coordinates = [
  [-73.98330688476561, 40.76975180901395],
  [-73.96682739257812, 40.761560925502806],
  [-74.00751113891602, 40.746346606483826],
  [-73.95343780517578, 40.7849607714286],
  [-73.99017333984375, 40.71135347314246],
  [-73.98880004882812, 40.758960433915284],
  [-73.96064758300781, 40.718379593199494],
  [-73.95172119140624, 40.82731951134558],
  [-73.9829635620117, 40.769101775774935],
  [-73.9822769165039, 40.76273111352534],
  [-73.98571014404297, 40.748947591479705],
  [-73.99155, 40.73581],
  [-73.99155, 40.73681],
];

export const MapView: React.FC = () => {
  const renderMarks = () =>
    coordinates.map((coordinate, index) => (
      <Mapbox.PointAnnotation
        key={index}
        // onSelected={() => Alert.alert('iojo')}
        coordinate={coordinate}
        id="pt-ann">
        <Text>See</Text>
        <Image
          style={{flex: 1, width: 30, height: 40}}
          source={require('../../assets/images/marker.png')}
        />
        <Mapbox.Callout
          containerStyle={{backgroundColor: '#fff'}}
          contentStyle={{padding: 5}}>
          <View>
            <Text>Ciao</Text>
          </View>
        </Mapbox.Callout>
      </Mapbox.PointAnnotation>
    ));

  return (
    <Mapbox.MapView
      style={{flex: 1}}
      styleURL={Mapbox.StyleURL.Light}
      compassEnabled={false}
      logoEnabled={false}>
      <Mapbox.Camera zoomLevel={16} centerCoordinate={coordinates[0]} />
      {renderMarks()}
    </Mapbox.MapView>
  );
};
