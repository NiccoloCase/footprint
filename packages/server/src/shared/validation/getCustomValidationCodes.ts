/**
 * Restituisce i codici degli errori
 * @param constraints
 */
export const getCustomValidationCodes = (constraints: {
  [type: string]: string;
}): string[] => {
  if (!constraints) return;

  const keys = Object.keys(constraints);
  const codes = keys.map(constraint => {
    switch (constraint) {
      case 'isEmail':
        return 'IS_NOT_EMAIL';
      case 'length':
        return 'LENGTH_IS_WRONG';
      case 'matches':
        return 'INVALID_FORMAT';
      case 'isLongitude':
        return 'VALUE_MUST_BE_A_VALID_LONGITUDE';
      case 'isLatitude':
        return 'VALUE_MUST_BE_A_VALID_LATITUDE';
      case 'isPositive':
        return 'VALUE_MUST_BE_POSITIVE';
      case 'IsEmailAlreadyUsedConstraint':
        return 'EMAIL_IS_ALREADY_USED';
      case 'IsUsernameAlreadyUsedConstraint':
        return 'USERNAME_IS_ALREADY_USED';
      case 'IsLocationObjectConstraint':
        return 'INVALID_LOCATION_OBJECT';
      case 'IsCoordinatesArrayConstraint':
        return 'WRONG_COORDINATE_FORMAT';
      case 'IsPaginationOptionsObjectConstraint':
        return 'WRONG_PAGINATION_OPTION_FORMAT';
      default:
        return constraint;
    }
  });

  return codes;
};
