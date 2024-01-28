import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base/base.repository';
import { UserRoleEntity } from './user-role.entity';

export class UserRoleRepository extends BaseRepository<UserRoleEntity> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource, UserRoleEntity);
  }
}
