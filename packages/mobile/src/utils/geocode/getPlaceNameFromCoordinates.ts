import {MAPBOX_API_URL} from "../api";
import config from "@footprint/config";

interface GetPlaceNameFromCoordinatesOptions {
  superficialResearch?: boolean;
}

export const getPlaceNameFromCoordinates = async (
  longitude: number,
  latitude: number,
  options: GetPlaceNameFromCoordinatesOptions = {},
): Promise<any[]> => {
  let url = `${MAPBOX_API_URL}/mapbox.places/${longitude},${latitude}.json?access_token=${config.MAPBOX_ACCESS_TOKEN}`;

  if (options.superficialResearch) {
    const types = "country,region";
    url += `&types=${types}`;
  }

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features) throw new Error("An error has occurred");

  return data.features;
};
