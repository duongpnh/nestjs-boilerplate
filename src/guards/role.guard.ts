/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Entity, FindManyOptions, Repository } from 'typeorm';
import { EntityEnum, IRouteInfo, MAPPING_GQL_OPS_TO_ENTITY_ACTION } from '@common/constants/entity.constant';
import { ERROR } from '@common/constants/errors.constant';
import { ContextType } from '@common/enums/context-type.enum';
import { ErrorCode } from '@common/enums/error-code.enum';
import { ActionEnum } from '@permissions/enums/action.enum';
import { UserEntity } from '@users/user.entity';
import { ContextService } from '../providers/context.service';

interface IPropsCheckPermissionByAction {
  entity: string;
  action: string;
  userPermissions: Record<string, any>[];
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private readonly _userRepo: Repository<UserEntity>,
    private _jwtService: JwtService,
    private _reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request;
    let gqlInfo;

    const isPublic = this._reflector.get<boolean>('PUBLIC', context.getHandler());

    if (isPublic) return true;

    if (context.getType<GqlContextType>() === ContextType.GRAPHQL) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
      gqlInfo = ctx.getInfo();
    } else {
      request = context.switchToHttp().getRequest();
    }

    let isPassed = false;

    if (!gqlInfo) {
      isPassed = await this.checkUserPermissionRestAPI(request);
    } else {
      isPassed = await this.checkUserPermissionGraphQL(request, gqlInfo);
    }

    return isPassed;
  }

  determineEntityInGraphQL(gqlInfo: any): IRouteInfo | null {
    const { key } = gqlInfo.path;
    const routeInfo = MAPPING_GQL_OPS_TO_ENTITY_ACTION[key];

    if (!routeInfo) {
      return null;
    }

    const { entity } = routeInfo;
    ContextService.setEntity(entity);

    return routeInfo;
  }

  async getListRoleIdByUserId(userId: string): Promise<number[]> {
    const userRoleCondition = {
      relations: ['userRole'],
      where: { id: userId },
      withDeleted: true,
    } as FindManyOptions<unknown>;

    try {
      const user = await this._userRepo.findOne(userRoleCondition);
      const { userRole } = user;

      return [+userRole.roleId];
    } catch (_) {
      return [];
    }
  }

  checkPermissionByAction(props: IPropsCheckPermissionByAction): boolean {
    const { entity, action, userPermissions } = props;

    return userPermissions.some(
      (permission) => permission.entity.toLowerCase() === entity.toLowerCase() && permission.action === action,
    );
  }

  decodeAuthToken(token: string): any {
    const fullToken = token.replace('Bearer ', '');
    return this._jwtService.decode(fullToken, { json: true });
  }

  async checkUserPermissionForRequest(entityInfo: IRouteInfo): Promise<boolean> {
    const { entity, action } = entityInfo;
    const userPermissions = ContextService.getPermissions();

    if (!entity || !Array.isArray(userPermissions) || !userPermissions.length) return false;

    switch (action) {
      case ActionEnum.READ:
      case ActionEnum.CREATE:
      case ActionEnum.RESTORE:
      case ActionEnum.UPDATE:
      case ActionEnum.DELETE: {
        return await this.checkPermissionByAction({
          entity,
          action,
          userPermissions,
        });
      }

      default:
        return false;
    }
  }

  async checkUserPermissionGraphQL(request: any, gplInfo: any) {
    const { headers } = request;

    if (!headers.authorization) {
      return false;
    }

    const entityInfo = this.determineEntityInGraphQL(gplInfo);

    if (!entityInfo) {
      const fn = ERROR[ErrorCode.API_PERMISSION_MISSED];
      throw new InternalServerErrorException(typeof fn === 'function' && fn(gplInfo.fieldName));
    }

    return await this.checkUserPermissionForRequest(entityInfo);
  }

  determineEntityBasedOnUrl(method: string, route: RouteInfo): IRouteInfo {
    const endpointItems = (route.path || '').split('/');
    const prefix = endpointItems.length > 1 ? endpointItems[1] : null;

    const actions = {
      GET: ActionEnum.READ,
      POST: ActionEnum.CREATE,
      PUT: ActionEnum.UPDATE,
      PATCH: ActionEnum.UPDATE,
      DELETE: ActionEnum.DELETE,
    };

    let entity;

    if (prefix && prefix.toUpperCase() in EntityEnum) {
      entity = prefix.toUpperCase();
    }

    ContextService.setEntity(entity);

    return {
      entity: entity,
      action: actions[method],
    };
  }

  async checkUserPermissionRestAPI(request: any) {
    const { method, route, headers } = request;

    if (!headers.authorization) {
      return false;
    }
    const entityInfo = this.determineEntityBasedOnUrl(method, route);

    return await this.checkUserPermissionForRequest(entityInfo);
  }
}
