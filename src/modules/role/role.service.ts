import { ERROR } from '@common/constants/errors.constant';
import { ErrorCode } from '@common/enums/error-code.enum';
import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

import { GeneralLogger } from '@logger/general.logger';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleRepository } from './role.repository';

@Injectable()
export class RolesService {
  private readonly logger: GeneralLogger = new GeneralLogger(RolesService.name);

  constructor(private _repo: RoleRepository) {}

  /**
   * Create a new role
   * @param payload an object instance of {@link CreateRoleDto}
   * @returns a value of {@link HttpStatus}
   */
  async createRole(payload: CreateRoleDto): Promise<HttpStatus> {
    try {
      const { name } = payload;

      const role = await this._repo.findOne({
        where: { name: ILike(name) },
      });

      if (role) {
        throw new ConflictException(ERROR[ErrorCode.ROLE_EXISTED]);
      }

      return HttpStatus.CREATED;
    } catch (e) {
      this.logger.error(e);
      throw new BadRequestException(e);
    }
  }
}
