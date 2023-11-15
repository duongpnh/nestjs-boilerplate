import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractDto } from '@common/dto/abstract.dto';

@ObjectType()
export class PermissionDto extends AbstractDto {
  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  action: string;

  @Field(() => String)
  entity: string;

  @Field(() => String, { nullable: true })
  roleIdApplied?: string;
}
