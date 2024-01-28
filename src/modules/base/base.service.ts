import { PageOptionsDto } from '@common/dto/page-options.dto';
import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { BaseRepository } from './base.repository';

@Injectable()
export abstract class BaseService<E> {
  public readonly entityName: string;

  constructor(private _repository: BaseRepository<E>) {
    this.entityName = this._repository.metadata.name;
  }

  createBaseQueryBuilder(payload: PageOptionsDto): SelectQueryBuilder<E> {
    const { isDeleted, ids } = payload;

    const queryBuilder = this._repository.createQueryBuilder(this.entityName);

    if (ids?.length) {
      queryBuilder.whereInIds(ids);
    }

    if (isDeleted) queryBuilder.andWhere(`${this.entityName}.deleted_at IS NOT NULL`).withDeleted();

    return queryBuilder;
  }
}
