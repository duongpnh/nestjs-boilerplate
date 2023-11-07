import { Field, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DateTimeResolver } from 'graphql-scalars';
import { AbstractEntity } from '../entities/abstract.entity';

@ObjectType()
export abstract class AbstractDto {
  @ApiProperty()
  @Field(() => DateTimeResolver)
  createdAt: Date;

  @ApiProperty()
  @Field(() => DateTimeResolver)
  updatedAt: Date;

  @ApiPropertyOptional()
  @Field(() => DateTimeResolver, { nullable: true })
  deletedAt: Date;

  constructor(entity: AbstractEntity) {
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
    this.deletedAt = entity.deletedAt;
  }
}
