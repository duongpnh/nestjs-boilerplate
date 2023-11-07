import { Field, ObjectType } from '@nestjs/graphql';
import { TimestampResolver } from 'graphql-scalars';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { AbstractDto } from '../dto/abstract.dto';

@ObjectType()
export class AbstractEntity<T extends AbstractDto = AbstractDto> {
  @CreateDateColumn({
    type: 'timestamp without time zone',
  })
  @Field(() => TimestampResolver)
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
  })
  @Field(() => TimestampResolver)
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'timestamp without time zone',
    nullable: true,
  })
  @Field(() => TimestampResolver, { nullable: true })
  deletedAt: Date;

  constructor(e: T) {
    this.createdAt = e?.createdAt;
    this.updatedAt = e?.updatedAt;
    this.deletedAt = e?.deletedAt;
  }
}
