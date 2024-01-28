import { ERROR } from '@common/constants/errors.constant';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PagingResponseDto } from '@common/dto/paging-response.dto';
import { ErrorCode } from '@common/enums/error-code.enum';
import { ConfigService } from '@config/config.service';
import { GeneralLogger } from '@logger/general.logger';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UserRoleRepository } from '@user-role/user-role.repository';
import { Transactional } from 'typeorm-transactional';
import { BaseService } from '../base/base.service';
import { UtilsService } from './../../providers/utils.service';
import { UserDto } from './dto/user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UsersService extends BaseService<UserDto> implements OnModuleInit {
  private readonly logger: GeneralLogger = new GeneralLogger(UsersService.name);
  constructor(
    private _repo: UserRepository,
    private _userRoleRepo: UserRoleRepository,
    private _config: ConfigService,
  ) {
    super(_repo);
  }

  async onModuleInit() {
    await this.createSuperAdmin();
  }

  @Transactional()
  async createSuperAdmin(): Promise<void> {
    const { startupUser } = this._config;

    if (!startupUser.email) {
      throw new InternalServerErrorException(ERROR[ErrorCode.STARTUP_USER_REQUIRED]);
    }

    const { email, password, firstName, lastName } = startupUser;

    this.logger.log(`Checking startup user ${email}`);
    const userExisted = await this._repo.findOne({
      where: { email },
    });

    if (userExisted) {
      this.logger.success(`Startup user ${email} has already existed`);
      return;
    }

    try {
      this.logger.log(`Creating startup user ${email}`);
      const { salt, hash } = await UtilsService.hashPassword(password);

      const user = await this._repo.save({
        email,
        firstName,
        lastName,
        hash,
        salt,
        emailVerified: true,
      });
      await this._userRoleRepo.insert({
        userId: user.id,
        roleId: 1,
      });

      this.logger.success(`Create startup user ${email} success`);
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  /**
   * Get all of the users
   * @returns a list of users
   */
  async getUsers(options: PageOptionsDto): Promise<PagingResponseDto<UserDto>> {
    try {
      const { q } = options;
      const { entityName } = this;
      const qb = this.createBaseQueryBuilder(options);

      if (q) {
        qb.andWhere(`to_tsquery(CONCAT("${entityName}".first_name, ' | ', "${entityName}".last_name)) @@ :q`, {
          q,
        });
      }

      const { data, ...meta } = await qb.paginate(options);

      return data.toPageDto(meta, options);
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }
  }

  /**
   * Get an user by ID
   * @param id User's ID
   * @returns an object instance of {@link UserDto}
   */
  async getUserById(id: string): Promise<UserDto> {
    try {
      const user = await this._repo.findOneBy({ id });

      if (!user) {
        throw new NotFoundException(ERROR[ErrorCode.USER_NOT_FOUND]);
      }

      return user.toDto();
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }
  }
}
