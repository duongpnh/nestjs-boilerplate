import { Field, ObjectType } from '@nestjs/graphql';
import { EmailAddressResolver, UUIDResolver } from 'graphql-scalars';
import { AbstractDto } from '@common/dto/abstract.dto';
import { UserEntity } from '@users/user.entity';

@ObjectType()
export class UserDto extends AbstractDto {
  @Field(() => UUIDResolver)
  id: string;

  @Field(() => EmailAddressResolver)
  email: string;

  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  constructor(e: UserEntity) {
    super(e);
    this.id = e.id;
    this.email = e.email;
    this.firstName = e.firstName;
    this.lastName = e.lastName;
  }
}
