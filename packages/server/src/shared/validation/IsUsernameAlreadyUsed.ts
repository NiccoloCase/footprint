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
 * Controlla se l'username passata è già stato utilizzato da un altro utente
 */
@ValidatorConstraint({ async: true })
@Injectable()
export class IsUsernameAlreadyUsedConstraint
  implements ValidatorConstraintInterface {
  constructor(protected readonly usersService: UsersService) {}

  async validate(username: string, args: ValidationArguments) {
    try {
      const user = await this.usersService.getUserByUsername(username);
      if (user) return false;
      return !user;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export function IsUsernameAlreadyUsed(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameAlreadyUsedConstraint,
    });
  };
}
