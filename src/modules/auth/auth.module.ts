import { Module } from '@nestjs/common';
import { AuthController } from './controllers';
import { UserService } from './services';
import { PostgresUnitOfWorkModule } from 'src/database/unit-of-work/postgres';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PostgresUnitOfWorkModule],
  controllers: [AuthController],
  providers: [UserService, ConfigService],
})
export class AuthModule {}
