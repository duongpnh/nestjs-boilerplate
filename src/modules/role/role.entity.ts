import { AbstractEntity } from '@common/entities/abstract.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserRoleEntity } from '@user-role/user-role.entity';
import { RoleDto } from './dto/role.dto';

@Entity({ name: 'roles' })
export class RoleEntity extends AbstractEntity<RoleDto> {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => UserRoleEntity, (e) => e.role)
  userRoles: UserRoleEntity[];
}
