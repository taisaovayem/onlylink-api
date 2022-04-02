import { Module } from '@nestjs/common';
import { LikeController } from './controllers';
import { LikeService } from './services';
import { PostgresUnitOfWorkModule } from 'src/database/unit-of-work/postgres';
import { RedisCacheModule } from 'src/shared/cache';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PostgresUnitOfWorkModule, RedisCacheModule, ConfigModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
