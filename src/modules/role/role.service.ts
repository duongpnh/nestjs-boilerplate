import { BadRequestException, ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';
import { ERROR } from '@common/constants/errors.constant';
import { ErrorCode } from '@common/enums/error-code.enum';
import { ConfigService } from '@config/config.service';
import { RolePermissionEntity } from '@role-permission/role-permission.entity';

import { CreateRoleDto } from './dto/create-role.dto';
import { RoleEntity } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(RoleEntity)
    private _repo: Repository<RoleEntity>,
    @InjectDataSource()
    private _dataSource: DataSource,
    private _config: ConfigService,
  ) {}

  /**
   * Create a new role and attach role with permission permissions
   * @param payload an object instance of {@link CreateRoleDto}
   * @returns a value of {@link HttpStatus}
   */
  async createRole(payload: CreateRoleDto): Promise<HttpStatus> {
    const queryRunner = this._dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { manager } = queryRunner;
      const { name, permissions } = payload;

      const role = await manager.findOne(RoleEntity, {
        where: { name: ILike(name) },
      });

      if (role) {
        throw new ConflictException(ERROR[ErrorCode.ROLE_EXISTED]);
      }

      const newRole = await manager.save(RoleEntity, { name });
      // attach role with permissions
      const rolePermissions = permissions.map((permissionId: number) => ({ permissionId, roleId: newRole.id }));
      await manager.insert(RolePermissionEntity, rolePermissions);

      await queryRunner.commitTransaction();

      return HttpStatus.CREATED;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(e);
    } finally {
      await queryRunner.release();
    }
  }
}
