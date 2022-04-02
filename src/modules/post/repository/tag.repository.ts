import { BaseRepository } from 'src/database/repositories';
import { EntityRepository } from 'typeorm';
import { TagEntity } from '../entities';

@EntityRepository(TagEntity)
export class TagRepository extends BaseRepository<TagEntity> {
  getTag(tag: string) {
    return this.findOne({
      where: [
        {
          id: tag,
        },
        {
          name: tag,
        },
      ],
    });
  }

  getTagByName(tagName: string) {
    return this.findOne({
      where: {
        name: tagName,
      },
    });
  }

  saveTag(tagName: string) {
    return this.save({ name: tagName });
  }
}
