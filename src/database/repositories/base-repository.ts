import { EntityRepository, Repository } from 'typeorm';

@EntityRepository()
export class BaseRepository<T> extends Repository<T> {}
