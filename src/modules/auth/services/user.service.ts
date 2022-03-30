import { Injectable } from '@nestjs/common';
import { PostgresTransactionalRepository } from 'src/database/unit-of-work/postgres';
import { UserRepository } from '../repository';
import { LoginRequest, RegisterRequest, UserResponse } from '../dtos';
import { hashPassword } from '../helpers';
import { ConfigService } from '@nestjs/config';
import jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    private pgTransactionRepo: PostgresTransactionalRepository,
    private configService: ConfigService,
  ) {}

  get userRepository(): UserRepository {
    return this.pgTransactionRepo.getRepository(
      UserRepository,
    ) as UserRepository;
  }

  async register({ email, name, password }: RegisterRequest) {
    const passwordHashed = await hashPassword(password);
    const user = await this.userRepository.register({
      email,
      name,
      password: passwordHashed,
    });
    if (user) {
      const jwtPrivateKey = this.configService.get('JWT_PRIVATE_KEY');
      const token = jwt.sign({ id: user.id }, jwtPrivateKey);
      const refreshToken = 'aaaaaa';
      const reponse: UserResponse = {
        email: user.email,
        name: user.name,
        accessToken: token,
        refreshToken: refreshToken,
      };
      return reponse;
    }
    throw new Error('email đã tồn tại');
  }

  async login({ email, password }: LoginRequest) {
    const passwordHashed = await hashPassword(password);
    const user = await this.userRepository.login({
      email,
      password: passwordHashed,
    });
    if (user) {
      const jwtPrivateKey = this.configService.get('JWT_PRIVATE_KEY');
      const token = jwt.sign({ id: user.id }, jwtPrivateKey);
      const refreshToken = 'aaaaaa';
      const reponse: UserResponse = {
        email: user.email,
        name: user.name,
        accessToken: token,
        refreshToken: refreshToken,
      };
      return reponse;
    }
    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng');
  }
}
