import { Field, ObjectType } from '@nestjs/graphql';
import { EmailAddressResolver, UUIDResolver } from 'graphql-scalars';
import { AbstractDto } from '@common/dto/abstract.dto';

@ObjectType()
export class UserDto extends AbstractDto {
  @Field(() => UUIDResolver)
  id: string;

  @Field(() => EmailAddressResolver)
  email: string;
}
