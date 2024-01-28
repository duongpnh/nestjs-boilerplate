import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseRepository } from '../base/base.repository';
import { RoleEntity } from './role.entity';

export class RoleRepository extends BaseRepository<RoleEntity> {
  constructor(@InjectDataSource() dataSource: DataSource) {
    super(dataSource, RoleEntity);
  }
}
