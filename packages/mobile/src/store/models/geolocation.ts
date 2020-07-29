import {Position} from "../../utils/geocode";
import geolocation, {
  GeolocationError,
} from "@react-native-community/geolocation";
import {Action, action, Thunk, thunk} from "easy-peasy";
import {PermissionsAndroid} from "react-native";

export interface GeoModel {
  // Posizione dell'utente
  userPosition: Position | null;
  // Errore
  error: GeolocationError | null;
  // Cambia la posizione dell'utente
  setUserPosition: Action<GeoModel, Position | null>;
  // Imposta un errore
  setError: Action<GeoModel, GeolocationError | null>;
  // Inizia a registare la posizione dell'utente
  startRecordingLocation: Thunk<GeoModel>;
  // Reacupera la posizione del dipositvo
  fetchPosition: Thunk<GeoModel>;
  // Interrompe la registrazione della posizione del'utente
  stopRecordingLocation: Thunk<GeoModel>;
}

const geoModel: GeoModel = {
  userPosition: null,
  error: null,
  /**
   * Imposta la posizione dell'utente
   */
  setUserPosition: action((state, newPosition) => ({
    ...state,
    userPosition: newPosition,
  })),

  /**
   * Imposta un errore
   */
  setError: action((state, error) => ({
    ...state,
    error,
  })),

  /**
   * Recupera la posizione del dipositivo
   */
  fetchPosition: thunk((actions) =>
    geolocation.getCurrentPosition(
      (res) => {
        const {latitude, longitude, altitude} = res.coords;
        // elimina eventuali errori
        actions.setError(null);
        // imposta la nuova posizione
        actions.setUserPosition({latitude, longitude, altitude});
      },
      (err: GeolocationError) => {
        actions.setUserPosition(null);
        actions.setError(err);
      },
    ),
  ),

  /**
   * Inizia a registrare la posizione dell'utente
   */
  startRecordingLocation: thunk((actions) => {
    // Richiede i permessi
    PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);
    // Avvia la "registrazione" degli spostamenti
    geolocation.watchPosition(
      (response) => {
        const {latitude, longitude, altitude} = response.coords;
        // elimina eventuali errori
        actions.setError(null);
        // imposta la nuova posizione
        actions.setUserPosition({latitude, longitude, altitude});
      },
      (err: GeolocationError) => {
        actions.setUserPosition(null);
        actions.setError(err);
      },
    );
  }),

  /**
   * Interrompe la registrazione della posizione del'utente
   */
  stopRecordingLocation: thunk((actions) => {
    geolocation.stopObserving();
    // Ripristina lo stato
    actions.setUserPosition(null);
  }),
};

export default geoModel;
