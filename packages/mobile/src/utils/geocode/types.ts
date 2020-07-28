export enum PlaceTypes {
  COUNTRY = "country",
  REGION = "region",
  POSTCODE = "postcode",
  DISTRICT = "district",
  PLACE = "place",
  LOCALITY = "locality",
  NEIGHBORHOOD = "neighborhood",
  ADDRESS = "address",
  POI = "poi",
}

export interface Position {
  latitude: number;
  longitude: number;
  altitude: number | null;
}
