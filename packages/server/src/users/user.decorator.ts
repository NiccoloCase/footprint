import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { isEmpty, isArray } from 'lodash';

/**
 * Restituisce l'oggetto dell'utente se autenticato
 */

export const CurrentUser = createParamDecorator((data: string, arg: any) => {
  let req: Request;

  // GRAPHQL contxt
  if (isArray(arg)) {
    const [, , ctx] = arg;
    req = ctx.req;
  }
  // HTTP context
  else req = arg;

  if (isEmpty((req as any).user)) return null;
  return data ? (req as any).user[data] : (req as any).user;
});
