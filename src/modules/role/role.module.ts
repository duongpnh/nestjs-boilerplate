import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionEntity } from '@role-permission/role-permission.entity';

import { RoleEntity } from './role.entity';
import { RolesResolver } from './role.resolver';
import { RolesService } from './role.service';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity, RolePermissionEntity])],
  providers: [RolesResolver, RolesService],
})
export class RolesModule {}
