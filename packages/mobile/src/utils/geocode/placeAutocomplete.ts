import config from "@footprint/config";
import {MAPBOX_API_URL} from "../api";

interface PlaceAutocompleteOptions {
  /** Se ricercare soltanto città, regioni, nazioni etc... */
  superficialResearch?: boolean;
}

/**
 * Esegue la richiesta all'API di MAPBOX per il completamento "geografico" della stringa passata
 * @param query
 */
export const placeAutocomplete = async (
  query: string,
  options: PlaceAutocompleteOptions = {},
): Promise<any[]> => {
  let url = `${MAPBOX_API_URL}/mapbox.places/${query}.json?access_token=${config.MAPBOX_ACCESS_TOKEN}`;

  if (options.superficialResearch) {
    const types = "country,region";
    url += `&types=${types}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features) throw new Error("An error has occurred");

  return data.features;
};
