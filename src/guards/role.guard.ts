/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import {
  GRAPHQL_ANONYMOUS_ROUTES,
  IRouteInfo,
  MAPPING_GQL_OPS_TO_ENTITY_ACTION,
} from '@common/constants/entity.constant';
import { ERROR } from '@common/constants/errors.constant';
import { ContextType } from '@common/enums/context-type.enum';
import { ErrorCode } from '@common/enums/error-code.enum';
import { ActionEnum } from '@permissions/enums/action.enum';
import { UserEntity } from '@users/user.entity';
import { ContextService } from '../providers/context.service';

interface IPropsCheckPermissionByAction {
  entity: string;
  params: any;
  action: string;
  userPermissions: Record<string, any>[];
  gplInfo?: any;
  authId?: string;
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
      return true;
    }

    return this.checkUserPermissionGQL(request, gqlInfo);
  }

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

    return userPermissions.some((permission) => permission.entity === entity && permission.action === action);
  }

  decodeAuthToken(token: string): any {
    const fullToken = token.replace('Bearer ', '');
    return this._jwtService.decode(fullToken, { json: true });
  }

  async checkUserPermissionGQL(request: any, gplInfo: any) {
    const {
      headers: { authorization },
    } = request;
    const entityInfo = this.determineEntityInGQL(gplInfo);

    if (!entityInfo) {
      const fn = ERROR[ErrorCode.API_PERMISSION_MISSED];
      throw new InternalServerErrorException(typeof fn === 'function' && fn(gplInfo.fieldName));
    }

    let isPassed = false;

    isPassed = GRAPHQL_ANONYMOUS_ROUTES.some(
      (anonymousRoute) => anonymousRoute.action === entityInfo?.action && anonymousRoute.entity === entityInfo?.entity,
    );

    if (isPassed && !authorization) {
      return true;
    }

    if (!authorization) {
      return false;
    }

    const { entity, action } = entityInfo;

    const decodedToken = this.decodeAuthToken(authorization);

    const userPermissions = ContextService.getPermissions();

    switch (action) {
      case ActionEnum.READ:
      case ActionEnum.CREATE:
      case ActionEnum.RESTORE:
      case ActionEnum.UPDATE:
      case ActionEnum.DELETE: {
        const { params } = request;
        const authId = decodedToken.sub;
        isPassed = await this.checkPermissionByAction({
          entity,
          params,
          action,
          userPermissions,
          gplInfo,
          authId,
        });

        return isPassed;
      }

      default:
        return isPassed;
    }
  }
}
