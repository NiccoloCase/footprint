import {keys} from "@footprint/config";
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
): Promise<any[] | null> => {
  let url = `${MAPBOX_API_URL}/mapbox.places/${query}.json?access_token=${keys.MAPBOX_ACCESS_TOKEN}`;

  if (options.superficialResearch) {
    const types = "country,region";
    url += `&types=${types}`;
  }

  try {
    const res = await fetch(url);

    const data = await res.json();

    return data.features;
  } catch (err) {
    console.log(err);
    return null;
  }
};
