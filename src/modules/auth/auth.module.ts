import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { UserService } from './services';
import { PostgresUnitOfWorkModule } from 'src/database/unit-of-work/postgres';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheModule, CacheService } from 'src/shared/cache';

@Module({
  imports: [PostgresUnitOfWorkModule, RedisCacheModule, ConfigModule],
  controllers: [AuthController],
  providers: [UserService],
})
export class AuthModule {}
