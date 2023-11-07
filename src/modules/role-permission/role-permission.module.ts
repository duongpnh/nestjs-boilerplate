import { Module } from '@nestjs/common';
import { RoleScopeResolver } from './role-permission.resolver';
import { RoleScopeService } from './role-permission.service';

@Module({
  providers: [RoleScopeResolver, RoleScopeService],
})
export class RolePermissionModule {}
