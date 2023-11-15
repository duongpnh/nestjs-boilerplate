import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PageOptionsDto } from '@common/dto/page-options.dto';

@Injectable()
export abstract class BaseService<E> {
  public readonly entityName: string;

  constructor(private _repository: Repository<E>) {
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
