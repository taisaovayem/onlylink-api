import { Inject, Injectable, Scope } from '@nestjs/common';
import { Connection, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';
import { SAMPLE_POSTGRES_DATABASE_CONNECTION } from './constants';

@Injectable({ scope: Scope.REQUEST })
export class PostgresUnitOfWork {
  private transactionManager: EntityManager | null;
  private isolationLevel: IsolationLevel | null;

  constructor(
    @Inject(SAMPLE_POSTGRES_DATABASE_CONNECTION)
    private connection: Connection,
  ) {
    this.transactionManager = null;
  }

  getTransactionManager(): EntityManager | null {
    return this.transactionManager;
  }

  getConnection(): Connection {
    return this.connection;
  }

  setIsolationLevel(isolationLevel: IsolationLevel) {
    this.isolationLevel = isolationLevel;
    return this;
  }

  async withTransaction<T>(work: () => Promise<T>): Promise<T> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction(this.isolationLevel);
    this.transactionManager = queryRunner.manager;
    try {
      const result = await work();
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
      this.transactionManager = null;
      this.isolationLevel = undefined;
    }
  }
}
