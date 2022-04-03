import { BaseRepository } from 'src/database/repositories';
import { EntityRepository } from 'typeorm';
import { ListEntity, ListItemEntity } from '../entities';
import { PostEntity } from 'src/modules/post/entities';
import { hideLinkResultList } from 'src/modules/post/helpers';
import { POST_MODE } from 'src/modules/post/constants';

@EntityRepository(ListItemEntity)
export class ListItemRepository extends BaseRepository<ListItemEntity> {
  addToList(post: PostEntity, list: ListEntity) {
    return this.save({ post, list });
  }

  removeFromList(post: PostEntity, list: ListEntity) {
    return this.softDelete({ post, list });
  }

  async getPosts(
    userId: string,
    listId: string,
    page: number = 1,
    perPage: number = 10,
  ) {
    const [result, total] = await this.createQueryBuilder('list_item')
      .leftJoinAndSelect('list_item.post', 'post', 'list_item.post = post.id')
      .leftJoinAndSelect('post.author', 'user', 'post.author = user.id')
      .where('list_item.id = :listId', { listId })
      .andWhere('post.author = :userId OR post.mode = :mode', {
        userId,
        mode: POST_MODE.PUBLIC,
      })
      .take(perPage)
      .skip(perPage * (page - 1))
      .loadAllRelationIds({
        relations: ['id'],
      })
      .getManyAndCount();
    return hideLinkResultList(
      result.map((list) => list.post) as PostEntity[],
      total,
    );
  }
}
