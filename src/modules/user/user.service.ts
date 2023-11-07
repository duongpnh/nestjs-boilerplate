import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '@common/dto/page-options.dto';
import { PagingResponseDto } from '@common/dto/paging-response.dto';
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

      return this.paginate(options, () => {
        if (q) {
          qb.andWhere(`to_tsquery(CONCAT("${entityName}".first_name, ' | ', "${entityName}".last_name)) @@ :q`, {
            q,
          });
        }

        // remember to return query builder
        return qb;
      });
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
