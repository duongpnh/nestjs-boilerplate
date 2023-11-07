import { Field, ObjectType } from '@nestjs/graphql';
import { AbstractDto } from '@common/dto/abstract.dto';

@ObjectType()
export class RoleDto extends AbstractDto {
  @Field(() => String)
  name: string;
}
