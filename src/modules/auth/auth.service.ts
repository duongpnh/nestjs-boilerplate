/* eslint-disable @typescript-eslint/no-unused-vars */
import { ERROR } from '@common/constants/errors.constant';
import { ErrorCode } from '@common/enums/error-code.enum';
import { ConfigService } from '@config/config.service';
import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UtilsService } from '@providers/utils.service';
import { UserEntity } from '@users/user.entity';
import { DataSource, Repository } from 'typeorm';

import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectDataSource()
    private _dataSource: DataSource,
    private _jwtService: JwtService,
    private _config: ConfigService,
    @InjectRepository(UserEntity)
    private _userRepo: Repository<UserEntity>,
  ) {}

  /**
   * Register a new user, and add user's role
   * @param payload an object instance of {@link RegisterDto}
   * @returns HttpStatus: 200 - register success, 409 if email address has existed
   */
  async register(payload: RegisterDto): Promise<HttpStatus> {
    const { email, password } = payload;

    const userExisted = await this._userRepo.findOne({
      where: { email },
    });

    if (userExisted) {
      throw new ConflictException(ERROR[ErrorCode.ACCOUNT_EXISTED]);
    }

    try {
      const { salt, hash: passwordHash } = await UtilsService.hashPassword(password);
      await this._userRepo.save({
        ...payload,
        passwordHash,
        salt,
      });

      return HttpStatus.OK;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  /**
   * Login
   * @param payload an object instance of {@link LoginDto}
   * @returns
   * - an object instance of {@link LoginResponseDto}
   * - 404 - User does not exist
   * - 401 - Invalid credentials
   */
  async login(payload: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = payload;
    const { expirationTime } = this._config.jwtConfig;

    const user = await this._userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(ERROR[ErrorCode.USER_NOT_FOUND]);
    }

    try {
      const match = await UtilsService.comparePassword(password, user.salt, user.hash);

      if (!match) {
        throw new UnauthorizedException(ERROR[ErrorCode.INVALID_CREDENTIALS]);
      }

      const accessToken = await this._jwtService.signAsync({ id: user.id });
      const refreshToken = await this._jwtService.signAsync({ id: user.id }, { expiresIn: expirationTime });

      return {
        ...user,
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
