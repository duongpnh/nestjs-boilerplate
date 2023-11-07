import { Field, InputType } from '@nestjs/graphql';
import { EmailAddressResolver } from 'graphql-scalars';

@InputType()
export class LoginDto {
  @Field(() => EmailAddressResolver)
  email: string;

  @Field(() => String)
  password: string;
}
