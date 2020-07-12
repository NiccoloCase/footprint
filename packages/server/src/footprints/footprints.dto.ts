export class AddFootprintDTO {
  title: string;
  coordinates: [number, number];
  body?: string;
  media?: string;
}

export class GetNearFootprintsDTO {
  lng: number;
  lat: number;
  minDistance?: number;
  maxDistance?: number;
}
