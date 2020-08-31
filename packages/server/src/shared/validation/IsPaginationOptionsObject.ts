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
import { Location, PaginationOptions } from '../../graphql';
import { validationConfig } from '@footprint/config';

/**
 * Controlla che l'oggetto passato sia del tipo delle opzioni dell'impaginazione
 */
@ValidatorConstraint()
@Injectable()
export class IsPaginationOptionsObjectConstraint
  implements ValidatorConstraintInterface {
  validate(payload: PaginationOptions, args: ValidationArguments) {
    // Controlla che il valore passato sia un oggetto
    if (typeof payload !== 'object') return false;

    // Limita
    const { limit } = payload;
    if (limit < 0) return false;

    // Offset
    const { offset } = payload;
    if (offset > 0) return false;

    return true;
  }
}

export function IsPaginationOptionsObject(
  validationOptions?: ValidationOptions,
) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPaginationOptionsObjectConstraint,
    });
  };
}
