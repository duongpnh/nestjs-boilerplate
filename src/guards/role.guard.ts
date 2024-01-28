import { ContextType } from '@common/enums/context-type.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private _reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request;

    const isPublic = this._reflector.get<boolean>('PUBLIC', context.getHandler());

    if (isPublic) return true;

    if (context.getType<GqlContextType>() === ContextType.GRAPHQL) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      request = context.switchToHttp().getRequest();
    }

    // TODO: check permission

    return true;
  }
}
