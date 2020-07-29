export class AddFootprintDTO {
  title: string;
  coordinates: [number, number];
  locationName: string;
  media: string;
  body?: string;
}

export class GetNearFootprintsDTO {
  lng: number;
  lat: number;
  minDistance?: number;
  maxDistance?: number;
}
