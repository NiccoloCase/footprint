import React from 'react';
import {View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {Navigation} from './navigation';

MapboxGL.setAccessToken(
  'pk.eyJ1IjoibmljY29jYXNlIiwiYSI6ImNqcG1uem0wdDAxMTQ0MnJ3ZXF4N3dsOWMifQ.4Yq9p3SQ8U23fCF13m-7pw',
);

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Navigation />
    </View>
  );
};

export default App;
