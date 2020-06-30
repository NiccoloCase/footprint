import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

export enum ExecutionContextType {
  GRAPHQL,
  HTTP,
}

/**
 * Restituisce il tipo del Contesto di esecuzione.
 * credito: https://github.com/nestjs/nest/issues/1581#issuecomment-513918814
 */

export const getExecutionContextType = (context: ArgumentsHost) =>
  context.getArgs().length === 4
    ? ExecutionContextType.GRAPHQL
    : ExecutionContextType.HTTP;

/**
 * Restituisce l'oggetto della richiesta HTTP dal Contesto di esecuzione.
 * credito: https://github.com/nestjs/nest/issues/1581#issuecomment-513918814
 */
export const getReqFromExecutionContext = (
  context: ExecutionContext,
): Request =>
  getExecutionContextType(context) === ExecutionContextType.GRAPHQL
    ? GqlExecutionContext.create(context).getContext().req
    : context.switchToHttp().getRequest();
