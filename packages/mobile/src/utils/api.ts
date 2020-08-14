import {Platform} from "react-native";
import {keys} from "@footprint/config";

/**
 * URL dell'API del server
 */
export const API_URL = keys.IS_PRODUCTION
  ? keys.server.API_URL
  : `http://${Platform.OS === "android" ? "10.0.2.2" : "localhost"}:5000/api`;

/**
 * URL dell'API di Mapbox
 */

export const MAPBOX_API_URL = "https://api.mapbox.com/geocoding/v5";
