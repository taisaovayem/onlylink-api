import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresUnitOfWorkModule } from 'src/database/unit-of-work/postgres';
import { RedisCacheModule } from 'src/shared/cache';
import { PostController } from './controllers';
import { PostService } from './services';

@Module({
  imports: [PostgresUnitOfWorkModule, RedisCacheModule, ConfigModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
