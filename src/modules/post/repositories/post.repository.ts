import { BaseRepository } from 'src/database/repositories';
import { PostEntity, TagEntity } from '../entities';
import { EntityRepository, In, Like } from 'typeorm';
import { PostRequest } from '../dtos';
import { UserEntity } from 'src/modules/auth/entities';
import { POST_MODE_CONDITION } from '../constants';
import { hideLink, hideLinkResultList } from '../helpers';

@EntityRepository(PostEntity)
export class PostRepository extends BaseRepository<PostEntity> {
  async getPost(id: string) {
    const post = await this.findOne(id, { relations: ['author'] });
    return { ...post, link: hideLink(post.link) };
  }

  async getPosts(page: number = 1, perPage: number = 10) {
    const [result, total] = await this.findAndCount({
      take: perPage,
      skip: perPage * (page - 1),
      relations: ['author'],
    });
    return hideLinkResultList(result, total);
  }

  async getPostByUser(
    userId: string,
    mode: POST_MODE_CONDITION,
    page: number = 1,
    perPage: number = 10,
  ) {
    if ((mode = POST_MODE_CONDITION.ALL)) {
      const [result, total] = await this.findAndCount({
        take: perPage,
        skip: perPage * (page - 1),
        where: {
          author: userId,
        },
        relations: ['author'],
      });
      return hideLinkResultList(result, total);
    }
    const [result, total] = await this.findAndCount({
      take: perPage,
      skip: perPage * (page - 1),
      where: {
        author: userId,
        mode,
      },
      relations: ['author'],
    });
    return hideLinkResultList(result, total);
  }

  async getPostByTag(tagId: string, page: number = 1, perPage: number = 10) {
    const [result, total] = await this.findAndCount({
      take: perPage,
      skip: perPage * (page - 1),
      where: {
        mode: POST_MODE_CONDITION.PUBLIC,
        tags: Like(`%${tagId}%`),
      },
      relations: ['author'],
    });
    return hideLinkResultList(result, total);
  }

  async savePost(post: PostRequest, author: UserEntity, tags?: TagEntity[]) {
    const result = await this.save({
      ...post,
      author,
      tags: JSON.stringify(tags.map((tag: TagEntity) => tag.id)),
    });
    return {
      ...result,
      link: hideLink(result.link),
    };
  }

  deletePost(postId: string) {
    return this.softDelete(postId);
  }

  getLink(postId: string) {
    return this.findOne(postId, {
      select: ['link', 'author'],
      relations: ['author'],
    });
  }
}
