import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './modules/post';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, ConfigModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
