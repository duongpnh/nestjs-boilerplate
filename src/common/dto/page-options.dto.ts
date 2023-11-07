import { Field, InputType, Int } from '@nestjs/graphql';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { BooleanEnum } from '@common/enums/boolean.enum';
import { Sort } from '@common/enums/sort.enum';

@InputType()
export class PageOptionsDto {
  @ApiPropertyOptional({
    enum: Sort,
    default: Sort.DESC,
  })
  @IsOptional()
  @IsEnum(Sort)
  @Field(() => Sort, { defaultValue: Sort.DESC, description: 'The order of the records' })
  readonly order: Sort = Sort.DESC;

  @ApiPropertyOptional({
    description: 'Min: 1',
    default: 1,
  })
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(1)
  @Field(() => Int, { defaultValue: 1, description: 'Current page that records will be queried' })
  readonly page: number = 1;

  @ApiPropertyOptional({
    description: 'Min: 1 - Max: 100',
    default: 30,
  })
  @IsOptional()
  @Transform(({ value }) => +value)
  @IsInt()
  @Min(1)
  @Max(100)
  @Field(() => Int, { defaultValue: 30, description: 'The quantity of records' })
  readonly take: number = 30;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, description: 'The search text will be applied' })
  readonly q?: string;

  @ApiPropertyOptional({ enum: BooleanEnum })
  @IsOptional()
  @Transform(({ value }) => `${value}` === BooleanEnum.TRUE)
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, description: 'Set value for this to query the soft deleted records' })
  readonly isDeleted?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true, description: `A list of record's IDs` })
  ids?: string[];

  @ApiPropertyOptional({ enum: BooleanEnum })
  @IsOptional()
  @Transform(({ value }) => value === BooleanEnum.TRUE)
  @IsBoolean()
  @Field(() => Boolean, { nullable: true, description: 'Enable to TRUE to query all of the records' })
  readonly selectAll?: boolean;
}
