import {MAPBOX_API_URL} from "../api";
import config from "@footprint/config";

export const getPlaceNameFromCoordinates = async (
  longitude: number,
  latitude: number,
): Promise<any[]> => {
  const url = `${MAPBOX_API_URL}/mapbox.places/${longitude},${latitude}.json?access_token=${config.MAPBOX_ACCESS_TOKEN}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.features) throw new Error("An error has occurred");

  return data.features;
};
