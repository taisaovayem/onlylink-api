import { BaseRepository } from 'src/database/repositories';
import { RefreshTokenEntity, UserEntity } from '../entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(RefreshTokenEntity)
export class RefreshTokenRepository extends BaseRepository<RefreshTokenEntity> {
  addToken(user: UserEntity, token: string, expired: Date) {
    return this.save({ user, token, expired });
  }

  revokeToken(token: string) {
    return this.softDelete({ token });
  }

  revokeAllToken(user: UserEntity) {
    return this.softDelete({ user });
  }
}
