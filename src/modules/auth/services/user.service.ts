import { Injectable } from '@nestjs/common';
import { PostgresTransactionalRepository } from 'src/database/unit-of-work/postgres';
import { RefreshTokenRepository, UserRepository } from '../repositories';
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
import { add } from 'date-fns';
import { CacheService } from 'src/shared/cache';
import {
  InvalidSessionException,
  EmailExistError,
  EmailInvalidError,
  EmailPasswordInvalidError,
  EmptyFieldError,
} from '../errors';
import { isEmail } from 'class-validator';

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
    await this.cacheService.setObject(token, userInfo);
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
    if (tokenRecord.expired < new Date()) return new InvalidSessionException();
    const jwtPrivateKey = this.configService.get('JWT_PRIVATE_KEY');
    const token = jwt.sign({ id: tokenRecord.user.id }, jwtPrivateKey);
    const userInfo = { userId:tokenRecord.user.id };
    await this.cacheService.setObject(token, userInfo);
    await this.refreshTokenRepository.save({
      ...tokenRecord,
      expired: add(new Date(), { days: 30 }),
    });
    const user = await this.userRepository.findOne(tokenRecord.user.id);
    return {
      email: user.email,
      name: user.name,
      accessToken: token,
      refreshToken,
    };
  }

  async register({ email, name, password }: RegisterRequest) {
    if (!email || !name || !password) return new EmptyFieldError();
    if (!isEmail(email)) {
      return new EmailInvalidError();
    }

    const passwordHashed = await argon2.hash(password);
    try {
      const user = await this.userRepository.register({
        email,
        name,
        password: passwordHashed,
      });
      if (user) {
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
      return new EmailExistError();
    }
  }

  async login({ email, password }: LoginRequest) {
    const user = await this.userRepository.findOne({
      email,
    });
    if (user && (await argon2.verify(user.password, password))) {
      const { token, refreshToken } = await this.generateToken(user);
      const reponse: UserResponse = {
        email: user.email,
        name: user.name,
        accessToken: token,
        refreshToken: refreshToken,
      };
      return reponse;
    }
    return new EmailPasswordInvalidError();
  }

  revokeToken({ accessToken, refreshToken }: RevokeTokenRequest) {
    this.refreshTokenRepository.revokeToken(refreshToken);
    this.cacheService.delete(accessToken);
    return { status: 200 };
  }

  revokeAllToken(user: UserEntity) {
    this.refreshTokenRepository.revokeAllToken(user);
    this.cacheService.deleteAll();
    return { status: 200 };
  }

  async changePassword(userId: string, password: string) {
    const passwordHashed = await argon2.hash(password);
    return this.userRepository.changePassword(userId, passwordHashed);
  }

  async updateInfo(userId, info: Omit<LoginRequest, 'password'>) {
    const user = await this.userRepository.findOne(userId);
    return this.userRepository.save({
      ...user,
      ...info,
      password: user.password, // catch override password
    });
  }
}
