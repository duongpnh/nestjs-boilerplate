/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ERROR } from '@common/constants/errors.constant';
import { ErrorCode } from '@common/enums/error-code.enum';
import { ConfigService } from '@config/config.service';
import { comparePassword, hashPassword } from '@providers/utils.service';
import { UserEntity } from '@users/user.entity';

import { LoginDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource()
    private _dataSource: DataSource,
    private _jwtService: JwtService,
    private _config: ConfigService,
  ) {}

  async register(payload: RegisterDto): Promise<RegisterResponseDto> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const { manager } = queryRunner;

    const { email, password } = payload;

    const userExisted = await manager.findOne(UserEntity, {
      where: { email },
    });

    if (userExisted) {
      throw new BadRequestException(ERROR[ErrorCode.ACCOUNT_EXISTED]);
    }

    try {
      const { hash, salt } = await hashPassword(password);
      const user = await manager.save(UserEntity, {
        ...payload,
        hash,
        salt,
      });
      const accessToken = await this._jwtService.signAsync(payload);
      const refreshToken = await this._jwtService.signAsync({ id: user.id }, { expiresIn: '7d' });

      await queryRunner.commitTransaction();

      return {
        ...user,
        accessToken,
        refreshToken,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }

  async login(payload: LoginDto): Promise<RegisterResponseDto> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const { manager } = queryRunner;

    const { email, password } = payload;
    const { jwtConfig } = this._config;

    const user = await manager.findOne(UserEntity, {
      where: { email },
    });

    if (!user) {
      throw new BadRequestException(ERROR[ErrorCode.INVALID_CREDENTIALS]);
    }

    try {
      const match = await comparePassword(password, user.salt, user.hash);

      if (!match) {
        throw new UnauthorizedException(ERROR[ErrorCode.INVALID_CREDENTIALS]);
      }

      const accessToken = await this._jwtService.signAsync(payload);
      const refreshToken = await this._jwtService.signAsync({ id: user.id }, { expiresIn: jwtConfig.expirationTime });

      await queryRunner.commitTransaction();

      return {
        ...user,
        accessToken,
        refreshToken,
      };
    } catch (e) {
      await queryRunner.rollbackTransaction();

      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }
}
