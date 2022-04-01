import { BaseRepository } from 'src/database/repositories';
import { UserEntity } from 'src/modules/auth/entities';
import { EntityRepository } from 'typeorm';
import { LikeEntity, PostEntity } from '../entities';

@EntityRepository(LikeEntity)
export class LikeRepository extends BaseRepository<LikeEntity> {
  likeByPost(post: PostEntity) {
    return this.count({ post });
  }

  likeByUser(user: UserEntity, page: number = 1, perPage: number = 10) {
    return this.findAndCount({
      take: perPage,
      skip: perPage * (page - 1),
      where: {
        user,
      },
    });
  }

  addLike(user: UserEntity, post: PostEntity) {
    return this.save({ user, post });
  }

  removeLike(user: UserEntity, post: PostEntity) {
    return this.softDelete({ user, post });
  }
}
