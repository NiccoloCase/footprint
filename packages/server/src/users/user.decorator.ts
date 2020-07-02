import { createParamDecorator } from '@nestjs/common';
import { Express, Request } from 'express';
import { isEmpty, isArray } from 'lodash';
import { IUser } from './users.schema';

/**
 * Restituisce l'oggetto dell'utente se autenticato
 */

export const CurrentUser = createParamDecorator((data: string, arg: any):
  | IUser
  | Express.User => {
  let req: Request;

  // GRAPHQL contxt
  if (isArray(arg)) {
    const [, , ctx] = arg;
    req = ctx.req;
  }
  // HTTP context
  else req = arg;

  if (isEmpty(req.user)) return null;
  return data ? req.user[data] : req.user;
});
