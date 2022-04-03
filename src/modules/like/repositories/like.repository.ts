import { BaseRepository } from 'src/database/repositories';
import { UserEntity } from 'src/modules/auth/entities';
import { EntityRepository } from 'typeorm';
import { LikeEntity } from '../entities';
import { PostEntity } from 'src/modules/post/entities';
import { POST_MODE_CONDITION } from 'src/modules/post/constants';
import { hideLinkResultList } from 'src/modules/post/helpers';

@EntityRepository(LikeEntity)
export class LikeRepository extends BaseRepository<LikeEntity> {
  likeByPost(post: PostEntity) {
    return this.count({ post });
  }

  async likeByUser(
    userId: string,
    mode: POST_MODE_CONDITION,
    page: number = 1,
    perPage: number = 10,
  ) {
    if (mode === POST_MODE_CONDITION.ALL) {
      const [result, total] = await this.createQueryBuilder('like')
        .leftJoinAndSelect('like.post', 'post', 'like.post = post.id')
        .leftJoinAndSelect('post.author', 'user', 'post.author = user.id')
        .where('like.user = :userId', { userId })
        .take(perPage)
        .skip(perPage * (page - 1))
        .loadAllRelationIds({
          relations: ['id'],
        })
        .getManyAndCount();

      return hideLinkResultList(
        result.map((like) => like.post) as PostEntity[],
        total,
      );
    }

    const [result, total] = await this.createQueryBuilder('like')
      .leftJoinAndSelect('like.post', 'post', 'like.post = post.id')
      .leftJoinAndSelect('post.author', 'user', 'post.author = user.id')
      .where('like.user = :userId', { userId })
      .andWhere('post.mode = :mode', { mode })
      .take(perPage)
      .skip(perPage * (page - 1))
      .loadAllRelationIds({
        relations: ['id'],
      })
      .getManyAndCount();
    return hideLinkResultList(
      result.map((like) => like.post) as PostEntity[],
      total,
    );
  }

  addLike(user: UserEntity, post: PostEntity) {
    return this.save({ user, post });
  }

  removeLike(user: UserEntity, post: PostEntity) {
    return this.softDelete({ user, post });
  }
}
