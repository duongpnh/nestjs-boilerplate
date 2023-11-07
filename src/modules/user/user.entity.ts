import { Field, ObjectType } from '@nestjs/graphql';
import { EmailAddressResolver, UUIDResolver } from 'graphql-scalars';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '@common/entities/abstract.entity';
import { UserRoleEntity } from '@user-role/user-role.entity';

import { UserDto } from './dto/user.dto';

@ObjectType()
@Entity('users')
export class UserEntity extends AbstractEntity<UserDto> {
  @Field(() => UUIDResolver)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => EmailAddressResolver)
  @Column({ unique: true, length: 100 })
  email: string;

  @Field(() => String)
  @Column({ length: 50 })
  firstName: string;

  @Field(() => String)
  @Column({ length: 50 })
  lastName: string;

  @Field(() => String)
  @Column()
  hash: string;

  @Field(() => String)
  @Column()
  salt: string;

  @Field(() => UserRoleEntity)
  @OneToOne(() => UserRoleEntity, (e) => e.user)
  userRole: UserRoleEntity;
}
