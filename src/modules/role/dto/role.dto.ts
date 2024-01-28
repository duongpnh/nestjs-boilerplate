import { AbstractDto } from '@common/dto/abstract.dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoleDto extends AbstractDto {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  name: string;
}
