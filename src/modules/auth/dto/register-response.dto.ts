import { Field, ObjectType } from '@nestjs/graphql';
import { EmailAddressResolver, UUIDResolver } from 'graphql-scalars';

@ObjectType()
export class RegisterResponseDto {
  @Field(() => UUIDResolver)
  id: string;

  @Field(() => EmailAddressResolver)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}
