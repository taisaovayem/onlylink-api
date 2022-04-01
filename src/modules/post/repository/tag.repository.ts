import { BaseRepository } from 'src/database/repositories';
import { EntityRepository } from 'typeorm';
import { TagEntity } from '../entities';

@EntityRepository(TagEntity)
export class TagRepository extends BaseRepository<TagEntity> {
  getTag(tagId: string) {
    return this.findOne(tagId);
  }

  getTagByName(tagName: string) {
    return this.findOne({ name: tagName });
  }

  saveTag(tagName: string) {
    return this.save({ name: tagName });
  }
}
