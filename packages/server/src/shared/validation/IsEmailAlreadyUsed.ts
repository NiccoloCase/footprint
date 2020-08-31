import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

/**
 * Controlla se l'email passata è già stata utilizzata da un altro utente
 */
@ValidatorConstraint({ async: true })
@Injectable()
export class IsEmailAlreadyUsedConstraint
  implements ValidatorConstraintInterface {
  constructor(protected readonly usersService: UsersService) {}

  async validate(email: string, args: ValidationArguments) {
    try {
      const user = await this.usersService.getUserByEmail(email);
      if (user) return false;
      return !user;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export function IsEmailAlreadyUsed(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyUsedConstraint,
    });
  };
}
