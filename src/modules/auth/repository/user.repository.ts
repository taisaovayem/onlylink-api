import { BaseRepository } from 'src/database/repositories';
import { UserEntity } from '../entities';
import { LoginRequest, RegisterRequest } from '../dtos';
import { EntityRepository } from 'typeorm';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
  async register({
    email,
    name,
    password,
  }: RegisterRequest): Promise<UserEntity> {
    return this.save({ email, name, password });
  }

  async login({ email, password }: LoginRequest): Promise<UserEntity> {
    return this.findOneOrFail({ email, password });
  }
}
