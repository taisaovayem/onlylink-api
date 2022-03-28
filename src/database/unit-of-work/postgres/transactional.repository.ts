import { Injectable, Scope } from '@nestjs/common';
import { ObjectType, Repository } from 'typeorm';
import { PostgresUnitOfWork } from './unit-of-work';
import { BaseRepository } from '../../repositories';

@Injectable({ scope: Scope.REQUEST })
export class PostgresTransactionalRepository {
  constructor(private uow: PostgresUnitOfWork) {}
  getRepository<Entity>(repository: ObjectType<Repository<Entity>>) {
    const transactionManager = this.uow.getTransactionManager();
    if (transactionManager) {
      return transactionManager.getCustomRepository(
        repository,
      ) as BaseRepository<Entity>;
    }
    return this.uow
      .getConnection()
      .getCustomRepository(repository) as BaseRepository<Entity>;
  }
}
