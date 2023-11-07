import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleEntity } from './user-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoleEntity])],
})
export class UserRoleModule {}
