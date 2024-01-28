import { Module } from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { RolesResolver } from './role.resolver';
import { RolesService } from './role.service';

@Module({
  providers: [RolesResolver, RolesService, RoleRepository],
})
export class RolesModule {}
