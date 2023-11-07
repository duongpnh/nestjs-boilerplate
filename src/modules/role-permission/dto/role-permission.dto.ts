import { Field, Int, ObjectType } from '@nestjs/graphql';
import { AbstractDto } from '@common/dto/abstract.dto';

@ObjectType()
export class RolePermissionDto extends AbstractDto {
  @Field(() => Int)
  roleId: number;

  @Field(() => Int)
  permissionId: number;
}
