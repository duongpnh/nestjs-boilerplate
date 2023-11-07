import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityEnum } from '@common/constants/entity.constant';
import { AbstractEntity } from '@common/entities/abstract.entity';

import { ScopeDto } from './dto/permission.dto';
import { ActionEnum } from './enums/action.enum';
import { RolePermissionEntity } from '../role-permission/role-permission.entity';

@Entity({ name: 'permissions' })
@ObjectType()
export class PermissionEntity extends AbstractEntity<ScopeDto> {
  @PrimaryGeneratedColumn('increment')
  @Field(() => Int)
  id: number;

  @Column({ unique: true })
  @Field(() => String)
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  description: string;

  @Column({ nullable: true, type: 'enum', enum: ActionEnum })
  @Field(() => ActionEnum, { nullable: true })
  action: ActionEnum;

  @Column({ nullable: true, type: 'enum', enum: EntityEnum })
  @Field(() => EntityEnum, { nullable: true })
  entity: EntityEnum;

  @Column({ nullable: true, type: 'int4' })
  @Field(() => Int, { nullable: true })
  roleIdApplied: number;

  @OneToMany(() => RolePermissionEntity, (roleScope) => roleScope.permission)
  rolePermissions!: RolePermissionEntity[];
}
