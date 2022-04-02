import { Module } from '@nestjs/common';
import { CommentController } from './controllers';
import { CommentService } from './services';
import { PostgresUnitOfWorkModule } from 'src/database/unit-of-work/postgres';
import { RedisCacheModule } from 'src/shared/cache';

@Module({
  imports: [PostgresUnitOfWorkModule, RedisCacheModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
