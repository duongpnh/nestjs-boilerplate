import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

@InputType()
export class CreateRoleDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @Field(() => String)
  name: string;

  @Field(() => [Int])
  permissions: number[];
}
