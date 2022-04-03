import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PostgresUnitOfWorkModule } from 'src/database/unit-of-work/postgres';
import { RedisCacheModule } from 'src/shared/cache';
import { ListController } from './controllers';
import { ListService } from './services';

@Module({
  imports: [PostgresUnitOfWorkModule, RedisCacheModule, ConfigModule],
  controllers: [ListController],
  providers: [ListService],
})
export class ListModule {}
