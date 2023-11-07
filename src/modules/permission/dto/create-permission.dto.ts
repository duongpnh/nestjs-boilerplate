import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { EntityEnum } from '@common/constants/entity.constant';
import { ActionEnum } from '@permissions/enums/action.enum';

@InputType()
export class CreatePermissionDto {
  @IsString({ message: 'name must be a string' })
  @Field(() => String)
  name: string;

  @IsEnum(ActionEnum)
  @Field(() => ActionEnum)
  action: ActionEnum;

  @IsEnum(EntityEnum)
  @Field(() => EntityEnum)
  entity: EntityEnum;

  @IsOptional()
  @IsString({ message: 'description must be a string' })
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  roleIdApplied?: number;
}
