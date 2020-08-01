/**
 * Calcola il centro dell'area determinata dall'array di punti passato
 * @param coordinates
 */
export const calculateCenter = (coordinates: number[][]) => {
  const n = coordinates.length;
  let lng = 0;
  let lat = 0;

  for (let coordinate of coordinates) {
    lng += coordinate[0];
    lat += coordinate[1];
  }

  return [lng / n, lat / n];
};
