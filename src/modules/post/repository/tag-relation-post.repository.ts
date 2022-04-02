import { BaseRepository } from 'src/database/repositories';
import { EntityRepository } from 'typeorm';
import { TagRelationPostEntity, PostEntity, TagEntity } from '../entities';

@EntityRepository(TagRelationPostEntity)
export class TagRelationPostRepository extends BaseRepository<TagRelationPostEntity> {
  addRelation(tag: TagEntity, post: PostEntity) {
    return this.save({ tag, post });
  }

  deleteRelation(post: PostEntity) {
    return this.softDelete({ post });
  }
}
