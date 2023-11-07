import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { ERROR } from '@common/constants/errors.constant';
import { ErrorCode } from '@common/enums/error-code.enum';

import { CreatePermissionDto } from './dto/create-permission.dto';
import { PermissionEntity } from './permission.entity';

@Injectable()
export class ScopesService {
  constructor(
    @InjectRepository(PermissionEntity)
    private _repo: Repository<PermissionEntity>,
  ) {}

  /**
   * Create a new permission
   * @param payload an object instance of {@link CreateRoleDto}
   * @returns a value of {@link HttpStatus}
   */
  async createScope(payload: CreatePermissionDto): Promise<HttpStatus> {
    try {
      const { name } = payload;

      const permission = await this._repo.findOne({
        where: { name: ILike(name) },
      });

      if (permission) {
        throw new ConflictException(ERROR[ErrorCode.SCOPE_EXISTED]);
      }

      await this._repo.insert(payload);

      return HttpStatus.CREATED;
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
