import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '@common/entities/abstract.entity';
import { RolePermissionEntity } from '@role-permission/role-permission.entity';

import { UserRoleEntity } from '@user-role/user-role.entity';
import { RoleDto } from './dto/role.dto';

@ObjectType()
@Entity({ name: 'roles' })
export class RoleEntity extends AbstractEntity<RoleDto> {
  @Field(() => Int)
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  name: string;

  @Field(() => [RolePermissionEntity], { nullable: true })
  @OneToMany(() => RolePermissionEntity, (permission) => permission.role)
  rolePermissions: RolePermissionEntity[];

  @OneToMany(() => UserRoleEntity, (e) => e.role)
  userRoles: UserRoleEntity[];
}
