import React from "react";
import {View} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import {GoogleSignin} from "@react-native-community/google-signin";
import {StoreProvider} from "easy-peasy";
import {Navigation} from "./navigation";
import {ApolloProvider} from "./graphql";
import config from "@footprint/config";
import {store} from "./store";

import Snackbar from "react-native-snackbar";

Snackbar.show({
  text: "Hello world",
  duration: Snackbar.LENGTH_SHORT,
});

MapboxGL.setAccessToken(config.MAPBOX_ACCESS_TOKEN);
GoogleSignin.configure({
  offlineAccess: true,
  webClientId: config.googleOAuth.WEB_CLIENT_ID,
});

const App = () => {
  return (
    <View style={{flex: 1}}>
      <StoreProvider store={store}>
        <ApolloProvider>
          <Navigation />
        </ApolloProvider>
      </StoreProvider>
    </View>
  );
};

export default App;
