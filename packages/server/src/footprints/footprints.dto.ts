import {
  Length,
  IsLongitude,
  IsLatitude,
  IsOptional,
  Min,
} from 'class-validator';
import { validationConfig } from '@footprint/config';
import { IsCoordinatesArray } from '../shared/validation';

export class AddFootprintDTO {
  // TITOLO
  @Length(
    validationConfig.footprint.title.length.min,
    validationConfig.footprint.title.length.max,
  )
  title: string;
  // COOORDINATE
  @IsCoordinatesArray()
  coordinates: [number, number];
  // NOME DELLA LOCALITA'
  @Length(1, validationConfig.locationName.length.max)
  locationName: string;
  // FOTO-VIDEO
  media: string;
  // DESCRIZIONE
  @IsOptional()
  @Length(0, validationConfig.footprint.body.length.max)
  body?: string;
}

export class GetNearFootprintsDTO {
  // LATITUINE
  @IsLongitude()
  lng: number;
  // LONGITUDINE
  @IsLatitude()
  lat: number;
  // DISTANZA MINIMA
  @IsOptional()
  @Min(0)
  minDistance?: number;
  // DISTANZA MASSIMA
  @IsOptional()
  @Min(0)
  maxDistance?: number;
}
