import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionEntity } from './permission.entity';
import { ScopesResolver } from './permission.resolver';
import { ScopesService } from './permission.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionEntity])],
  providers: [ScopesResolver, ScopesService],
})
export class PermissionModule {}
