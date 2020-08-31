import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { getCustomValidationCodes } from './getCustomValidationCodes';

export const CustumValidationPipe = new ValidationPipe({
  exceptionFactory: (validationErrors: ValidationError[]) => {
    const errors = validationErrors.map(error => {
      const codes = getCustomValidationCodes(error.constraints);
      return {
        field: error.property,
        value: error.value,
        codes,
      };
    });
    return new BadRequestException({
      name: 'VALIDATION_ERROR',
      message: 'Validation error',
      errors,
    });
  },
});
