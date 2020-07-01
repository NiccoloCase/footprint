import {Platform} from "react-native";
import config from "@footprint/config";

/**
 * URL dell'API del server
 */
export const API_URL = config.IS_PRODUCTION
  ? config.server.API_URL
  : `http://${Platform.OS === "android" ? "10.0.2.2" : "localhost"}:5000/api`;
