import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ANONYMOUS_ROUTES,
  GRAPHQL_ANONYMOUS_ROUTES,
  IRouteInfo,
  MAPPING_GQL_OPS_TO_ENTITY_ACTION,
} from '@common/constants/entity.constant';
import { ERROR } from '@common/constants/errors.constant';
import { ContextType } from '@common/enums/context-type.enum';
import { ErrorCode } from '@common/enums/error-code.enum';
import { ConfigService } from '@config/config.service';
import { ContextService } from '@providers/context.service';
import { UserEntity } from '@users/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    @InjectRepository(UserEntity)
    private _userRepo: Repository<UserEntity>,
    private _configService: ConfigService,
    private _jwtService: JwtService,
  ) {}

  determineEntityInGQL(gqlInfo: any): IRouteInfo | null {
    const { key } = gqlInfo.path;
    const routeInfo = MAPPING_GQL_OPS_TO_ENTITY_ACTION[key];

    if (!routeInfo) {
      return null;
    }

    const { entity } = routeInfo;
    ContextService.setEntity(entity);

    return routeInfo;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.get<boolean>('PUBLIC', context.getHandler());
    const isBasicAuth = this._reflector.get<boolean>('basic', context.getHandler());

    if (isPublic) return true;

    if (isBasicAuth) return true;

    let request;
    let isPublicRoute;

    if (context.getType() === ContextType.HTTP) {
      request = context.switchToHttp().getRequest();
      const { method, route } = request;

      isPublicRoute = ANONYMOUS_ROUTES.some(
        (anonymousRoute) => anonymousRoute.method === method && anonymousRoute.routePath === route.path,
      );
    } else if (context.getType<GqlContextType>() === ContextType.GRAPHQL) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
      const gplInfo = ctx.getInfo();
      const entityInfo = this.determineEntityInGQL(gplInfo);

      isPublicRoute = GRAPHQL_ANONYMOUS_ROUTES.some(
        (anonymousRoute) =>
          anonymousRoute.action === entityInfo?.action && anonymousRoute.entity === entityInfo?.entity,
      );
    }

    const token = (request.headers.authorization || '').split(' ')?.[1];

    if (isPublicRoute && !token) {
      return true;
    }

    const { jwtConfig } = this._configService;

    try {
      const res = await this._jwtService.verify(token, { secret: jwtConfig.key });

      // Check user already exist on cognito
      const user = await this._userRepo.findOne({
        where: { email: res?.email },
        relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
      });

      if (!user) {
        throw new ForbiddenException(ERROR[ErrorCode.FORBIDDEN_RESOURCE]);
      }

      // const { role } = user;
      // const { rolePermissions } = role;

      // const permissions = (rolePermissions || []).map(({ permission }) => {
      //   return permission;
      // });

      // ContextService.setPermissions(permissions);

      return true;
    } catch (e) {
      return false;
    }
  }
}
