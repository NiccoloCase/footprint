import React from "react";
import {View, StatusBar, StyleSheet} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import {GoogleSignin} from "@react-native-community/google-signin";
import {StoreProvider} from "easy-peasy";
import {Navigation} from "./navigation";
import {ApolloProvider} from "./graphql";
import {keys} from "@footprint/config";
import {store} from "./store";

// Avvia la registrazione della posizione dell'utente
store.getActions().geo.startRecordingLocation();
// Inizializza le mappe
MapboxGL.setAccessToken(keys.MAPBOX_ACCESS_TOKEN);
// Inizializza l'autenticazione con google
GoogleSignin.configure({
  offlineAccess: false,
  webClientId: keys.googleOAuth.WEB_CLIENT_ID,
});

const App = () => {
  return (
    <View style={styles.app}>
      <StoreProvider store={store}>
        <ApolloProvider>
          <StatusBar backgroundColor="#fff" barStyle="dark-content" />
          <Navigation />
        </ApolloProvider>
      </StoreProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default App;
