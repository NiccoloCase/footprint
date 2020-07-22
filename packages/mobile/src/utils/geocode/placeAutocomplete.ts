import config from "@footprint/config";
import {MAPBOX_API_URL} from "../api";

/**
 * Esegue la richiesta all'API di MAPBOX per il completamento "geografico" della stringa passata
 * @param query
 */
export const placeAutocomplete = async (query: string): Promise<any[]> => {
  const url = `${MAPBOX_API_URL}/mapbox.places/${query}.json?access_token=${config.MAPBOX_ACCESS_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features) throw new Error("An error has occurred");

  return data.features;
};
