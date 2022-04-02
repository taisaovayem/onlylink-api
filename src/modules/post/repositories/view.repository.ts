import { BaseRepository } from 'src/database/repositories';
import { Between, EntityRepository } from 'typeorm';
import { PostEntity, ViewEntity } from '../entities';
import { UserEntity } from 'src/modules/auth/entities';

@EntityRepository(ViewEntity)
export class ViewRepository extends BaseRepository<ViewEntity> {
  addView(post: PostEntity, user: UserEntity) {
    return this.save({
      post,
      user,
    });
  }

  getView(post: PostEntity) {
    return this.count({ post });
  }

  getViewRange(post: PostEntity, startDate: Date, endDate: Date) {
    return this.count({
      where: {
        post,
        createdAt: Between(startDate, endDate),
      },
    });
  }
}
