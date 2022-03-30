import { BaseRepository } from 'src/database/repositories';
import { UserEntity } from '../entities';
import { LoginRequest, RegisterRequest, UserResponse } from '../dtos';

export class UserRepository extends BaseRepository<UserEntity> {
  async register({
    email,
    name,
    password,
  }: RegisterRequest): Promise<UserEntity> {
    return this.create({ email, name, password });
  }

  async login({ email, password }: LoginRequest): Promise<UserEntity> {
    return this.findOneOrFail({ email, password });
  }
}
