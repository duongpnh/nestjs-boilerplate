import { Field, Int, ObjectType } from '@nestjs/graphql';
import { RoleEntity } from '@roles/role.entity';
import { UserEntity } from '@users/user.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'user_role' })
export class UserRoleEntity {
  @Field(() => Int)
  @PrimaryColumn('int4')
  roleId: number;

  @Field(() => String)
  @PrimaryColumn('uuid')
  userId: string;

  @Field(() => RoleEntity)
  @ManyToOne(() => RoleEntity, (e) => e.userRoles)
  role: RoleEntity;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
