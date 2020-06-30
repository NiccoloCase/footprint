import {
  Injectable,
  ExecutionContext,
  applyDecorators,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { Observable } from 'rxjs';
import {
  getExecutionContextType,
  ExecutionContextType,
} from 'src/shared/executionContext';

/**
 * Percorso privato.
 * Richiede un JWT
 */
export function Private() {
  return applyDecorators(UseGuards(AuthGuard));
}

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let executionContext: ExecutionContext;

    // Controlla se la richiesta è stata effettuata tramite Graphql o HTTP
    switch (getExecutionContextType(context)) {
      // GRAPHQL
      case ExecutionContextType.GRAPHQL:
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        executionContext = new ExecutionContextHost([req]);
        break;
      // HTTP
      default:
        executionContext = context;
    }

    return super.canActivate(executionContext);
  }
}
