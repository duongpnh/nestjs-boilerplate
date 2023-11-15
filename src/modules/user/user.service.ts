import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ERROR } from '@common/constants/errors.constant';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PagingResponseDto } from '@common/dto/paging-response.dto';
import { ErrorCode } from '@common/enums/error-code.enum';
import { GeneralLogger } from '@logger/general.logger';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './user.entity';
import { BaseService } from '../base/base.service';

@Injectable()
export class UsersService extends BaseService<UserDto> {
  private readonly logger: GeneralLogger = new GeneralLogger(UsersService.name);
  constructor(@InjectRepository(UserEntity) private _repo: Repository<UserEntity>) {
    super(_repo);
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
      throw new BadRequestException(e);
    }
  }
}
