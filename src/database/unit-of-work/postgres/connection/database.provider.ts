import { Connection, createConnection } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { POSTGRES_DATABASE_CONNECTION } from '../constants';
import { UserEntity, RefreshTokenEntity } from 'src/modules/auth/entities';

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
        entities: [UserEntity, RefreshTokenEntity],
        migrations: [__dirname + '/../../../migrations/*{.ts,.js}'],
        synchronize: false,
        migrationsRun: configService.get<string>('RUN_MIGRATIONS') === 'true',
        logging: true,
      });
    },
    inject: [ConfigService],
  },
];
