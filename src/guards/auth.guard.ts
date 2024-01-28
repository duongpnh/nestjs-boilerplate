import { ERROR } from '@common/constants/errors.constant';
import { ContextType } from '@common/enums/context-type.enum';
import { ErrorCode } from '@common/enums/error-code.enum';
import { ConfigService } from '@config/config.service';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ContextService } from '@providers/context.service';
import { UserEntity } from '@users/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector,
    @InjectRepository(UserEntity)
    private _userRepo: Repository<UserEntity>,
    private _configService: ConfigService,
    private _jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this._reflector.get<boolean>('PUBLIC', context.getHandler());
    const isBasicAuth = this._reflector.get<boolean>('basic', context.getHandler());

    if (isPublic) return true;

    if (isBasicAuth) return true;

    let request;
    let isPublicRoute;

    if (context.getType<GqlContextType>() === ContextType.GRAPHQL) {
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    } else {
      request = context.switchToHttp().getRequest();
    }

    const token = (request.headers.authorization || '').split(' ')?.[1];

    if (isPublicRoute && !token) {
      return true;
    }

    const { jwtConfig } = this._configService;

    try {
      const decodedToken = await this._jwtService.verify(token, { secret: jwtConfig.key });

      const user = await this._userRepo.findOne({
        where: { id: decodedToken.id },
        relations: ['userRole', 'userRole.role'],
      });

      if (!user) {
        throw new ForbiddenException(ERROR[ErrorCode.FORBIDDEN_RESOURCE]);
      }

      ContextService.setAuthUserInfo(user);

      return true;
    } catch (e) {
      if (e?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(ERROR[ErrorCode.TOKEN_EXPIRES]);
      }

      return false;
    }
  }
}
