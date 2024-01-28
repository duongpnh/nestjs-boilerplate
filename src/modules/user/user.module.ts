import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleModule } from '@user-role/user-role.module';
import { UsersController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UsersResolver } from './user.resolver';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserRoleModule],
  providers: [UsersService, UsersResolver, UserRepository],
  controllers: [UsersController],
})
export class UsersModule {}
