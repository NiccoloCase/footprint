import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  isLongitude,
  isLatitude,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { Location } from '../../graphql';
import { validationConfig } from '@footprint/config';

/**
 * Controlla che l'oggetto passato contegna una posizione
 */
@ValidatorConstraint()
@Injectable()
export class IsLocationObjectConstraint
  implements ValidatorConstraintInterface {
  validate(payload: Location, args: ValidationArguments) {
    // Controlla che il valore passato sia un oggetto
    if (typeof payload !== 'object') return false;

    // Controlla che sia presente un array di coordinate
    const { coordinates } = payload;
    if (!Array.isArray(coordinates) || coordinates.length !== 2) return false;

    if (
      !isLongitude(String(coordinates[0])) ||
      !isLatitude(String(coordinates[1]))
    )
      return false;

    // Valida il nome della posizione
    const { locationName } = payload;
    if (
      typeof locationName !== 'string' ||
      locationName.length > validationConfig.locationName.length.max
    )
      return false;

    return true;
  }
}

export function IsLocationObject(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsLocationObjectConstraint,
    });
  };
}
