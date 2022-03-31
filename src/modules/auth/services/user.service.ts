import { Injectable } from '@nestjs/common';
import { PostgresTransactionalRepository } from 'src/database/unit-of-work/postgres';
import { RefreshTokenRepository, UserRepository } from '../repository';
import {
  LoginRequest,
  RegisterRequest,
  RevokeTokenRequest,
  UserResponse,
} from '../dtos';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { UserEntity, RefreshTokenEntity } from '../entities';
import { ApiError } from 'src/shared/errors/api-error';
import { add } from 'date-fns';
import { CacheService } from 'src/shared/cache';
import { InvalidSessionException } from '../errors';

@Injectable()
export class UserService {
  constructor(
    private pgTransactionRepo: PostgresTransactionalRepository,
    private configService: ConfigService,
    private cacheService: CacheService,
  ) {}

  get userRepository(): UserRepository {
    return this.pgTransactionRepo.getRepository<UserEntity>(
      UserRepository,
    ) as UserRepository;
  }
  get refreshTokenRepository(): RefreshTokenRepository {
    return this.pgTransactionRepo.getRepository<RefreshTokenEntity>(
      RefreshTokenRepository,
    ) as RefreshTokenRepository;
  }

  async generateToken(user: UserEntity) {
    const jwtPrivateKey = this.configService.get('JWT_PRIVATE_KEY');
    const token = jwt.sign({ id: user.id }, jwtPrivateKey);
    const expired = add(new Date(), { days: 30 });
    const refreshToken = jwt.sign({ id: user.id, expired }, jwtPrivateKey);
    const userInfo = { userId: user.id };
    await this.cacheService.set(token, JSON.stringify(userInfo));
    this.refreshTokenRepository.addToken(user, refreshToken, expired);
    return { token, refreshToken };
  }

  async getAccessToken(refreshToken: string) {
    const tokenRecord = await this.refreshTokenRepository.findOne(
      {
        token: refreshToken,
      },
      { relations: ['user'] },
    );
    if (!tokenRecord) return new InvalidSessionException();
    const jwtPrivateKey = this.configService.get('JWT_PRIVATE_KEY');
    const token = jwt.sign({ id: tokenRecord.user.id }, jwtPrivateKey);
    await this.cacheService.set(token, tokenRecord.user.id);
    return { accessToken: token };
  }

  async register({ email, name, password }: RegisterRequest) {
    const passwordHashed = await argon2.hash(password);
    try {
      const user = await this.userRepository.register({
        email,
        name,
        password: passwordHashed,
      });
      if (user) {
        const jwtPrivateKey = this.configService.get('JWT_PRIVATE_KEY');
        const { token, refreshToken } = await this.generateToken(user);
        const reponse: UserResponse = {
          email: user.email,
          name: user.name,
          accessToken: token,
          refreshToken: refreshToken,
        };
        return reponse;
      }
    } catch (error) {
      return new ApiError({
        status: 403,
        message: 'Email đã tồn tại',
      });
    }
  }

  async login({ email, password }: LoginRequest) {
    const user = await this.userRepository.findOne({
      email,
    });
    if (user && (await argon2.verify(user.password, password))) {
      const jwtPrivateKey = this.configService.get('JWT_PRIVATE_KEY');
      const { token, refreshToken } = await this.generateToken(user);
      const reponse: UserResponse = {
        email: user.email,
        name: user.name,
        accessToken: token,
        refreshToken: refreshToken,
      };
      return reponse;
    }
    return new ApiError({
      status: 403,
      message: 'Email hoặc mật khẩu không đúng',
    });
  }

  revokeToken({ accessToken, refreshToken }: RevokeTokenRequest) {
    this.refreshTokenRepository.revokeToken(refreshToken);
    this.cacheService.delete(accessToken);
    return { status: 200 };
  }

  async revokeAllToken(user: UserEntity) {
    this.refreshTokenRepository.revokeAllToken(user);
    return { status: 200 };
  }
}
