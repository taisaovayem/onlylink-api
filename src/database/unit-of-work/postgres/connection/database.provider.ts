import { Connection, createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { POSTGRES_DATABASE_CONNECTION } from '../constants';
import { UserEntity, RefreshTokenEntity } from 'src/modules/auth/entities';
import { PostEntity, TagEntity, ViewEntity } from 'src/modules/post/entities';
import { LikeEntity } from 'src/modules/like/entities';
import { CommentEntity } from 'src/modules/comment/entities';

export const databaseProvider = [
  {
    provide: POSTGRES_DATABASE_CONNECTION,
    useFactory: async (configService: ConfigService): Promise<Connection> => {
      return createConnection({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get<number>('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [
          UserEntity,
          RefreshTokenEntity,
          LikeEntity,
          PostEntity,
          TagEntity,
          ViewEntity,
          CommentEntity,
        ],
        migrations: [__dirname + '/../../../migrations/*{.ts,.js}'],
        // synchronize: false,
        synchronize: true,
        // migrationsRun: configService.get<string>('RUN_MIGRATIONS') === 'true',
        migrationsRun: false,
        logging: true,
      });
    },
    inject: [ConfigService],
  },
];
