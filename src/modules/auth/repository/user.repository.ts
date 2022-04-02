import { BaseRepository } from 'src/database/repositories';
import { UserEntity } from '../entities';
import { LoginRequest, RegisterRequest } from '../dtos';
import { EntityRepository } from 'typeorm';
import { UserStatus } from '../constants';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
  async register({
    email,
    name,
    password,
  }: RegisterRequest): Promise<UserEntity> {
    return this.save({ email, name, password, status: UserStatus.active });
  }

  async login({ email, password }: LoginRequest): Promise<UserEntity> {
    return this.findOneOrFail({ email, password });
  }
}
