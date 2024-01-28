import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleEntity } from './user-role.entity';
import { UserRoleRepository } from './user-role.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleEntity])],
  providers: [UserRoleRepository],
  exports: [UserRoleRepository],
})
export class UserRoleModule {}
