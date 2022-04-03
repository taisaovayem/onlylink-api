import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './modules/post';
import { LikeModule } from './modules/like';
import { CommentModule } from './modules/comment';
import { ListModule } from './modules/list';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ConfigModule,
    PostModule,
    LikeModule,
    CommentModule,
    ListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
