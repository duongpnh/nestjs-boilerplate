import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { AbstractEntity } from '@common/entities/abstract.entity';
import { PermissionEntity } from '@permissions/permission.entity';
import { RoleEntity } from '@roles/role.entity';

import { RolePermissionDto } from './dto/role-permission.dto';

@Entity({ name: 'role_permission' })
@ObjectType()
export class RolePermissionEntity extends AbstractEntity<RolePermissionDto> {
  @PrimaryColumn({ type: 'int4' })
  @Field(() => Int)
  roleId: number;

  @PrimaryColumn({ type: 'int4' })
  @Field(() => Int)
  permissionId: number;

  @ManyToOne(() => PermissionEntity, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id' })
  @Field(() => PermissionEntity)
  permission: PermissionEntity;

  @ManyToOne(() => RoleEntity, (role) => role.rolePermissions)
  role: RoleEntity;
}
