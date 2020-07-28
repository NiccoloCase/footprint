import {getDistance} from "geolib";
import {store} from "../../store";

interface getDistanceFromUserResult {
  distance: number;
  formattedDistance: string;
}

export const getDistanceFromUser = (
  latitude: number,
  longitude: number,
): getDistanceFromUserResult | null => {
  const userPosition = store.getState().geo.userPosition;
  if (!userPosition) return null;
  // Calcola la distanza tra i due punti in metri
  const distance = getDistance(
    {latitude, longitude},
    {latitude: userPosition.latitude, longitude: userPosition.longitude},
  );

  // Trasforma la distanza in metri in una stringa più
  // facilmente leggibile dall'utente

  let digit: number;
  let unit: string;
  let formattedDistance: string;

  if (distance >= 1) {
    // Conversione in kilometri
    if (distance >= 1000) {
      unit = "km";
      digit = Math.round(distance / 1000);
    }
    // Conversioni in centimetri
    else if (distance < 1) {
      unit = "cm";
      digit = Math.round(distance * 100);
    }
    // Metri
    else {
      unit = "m";
      digit = Math.round(distance);
    }
    formattedDistance = digit + unit + " da te";
  }

  // Se la distanza è pressoché nulla:
  else formattedDistance = "Presso di te";

  return {
    distance,
    formattedDistance,
  };
};
