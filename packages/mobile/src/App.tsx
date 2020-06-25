import React from 'react';
import {View} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import {GoogleSignin} from '@react-native-community/google-signin';
import {Navigation} from './navigation';
import config from '@footprint/config';

MapboxGL.setAccessToken(config.MAPBOX_ACCESS_TOKEN);
GoogleSignin.configure({
  offlineAccess: true,
  webClientId: config.googleOAuth.WEB_CLIENT_ID,
});

const App = () => {
  return (
    <View style={{flex: 1}}>
      <Navigation />
    </View>
  );
};

export default App;
