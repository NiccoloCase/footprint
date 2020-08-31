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

/**
 * Controlla se l'array passato contine come primo valore una langitudine e come secondo
 * una latitudine
 */
@ValidatorConstraint()
@Injectable()
export class IsCoordinatesArrayConstraint
  implements ValidatorConstraintInterface {
  validate(array: string[], args: ValidationArguments) {
    if (!Array.isArray(array) || array.length !== 2) return false;

    const lng = array[0];
    const lat = array[1];

    return isLongitude(lng) && isLatitude(lat);
  }
}

export function IsCoordinatesArray(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCoordinatesArrayConstraint,
    });
  };
}
