import { BaseRepository } from 'src/database/repositories';
import { PostEntity, TagEntity } from '../entities';
import { EntityRepository, Like } from 'typeorm';
import { PostRequest } from '../dtos';
import { UserEntity } from 'src/modules/auth/entities';
import { POST_MODE_CONDITION } from '../constants';

@EntityRepository(PostEntity)
export class PostRepository extends BaseRepository<PostEntity> {
  async getPost(id: string) {
    return this.findOne(id);
  }

  async getPosts(page: number = 1, perPage: number = 10) {
    const [result, total] = await this.findAndCount({
      take: perPage,
      skip: perPage * (page - 1),
    });
    return {
      data: result,
      total,
    };
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
      });
      return {
        data: result,
        total,
      };
    }
    const [result, total] = await this.findAndCount({
      take: perPage,
      skip: perPage * (page - 1),
      where: {
        author: userId,
        mode,
      },
    });
    return {
      data: result,
      total,
    };
  }

  async getPostByTag(tag: TagEntity, page: number = 1, perPage: number = 10) {
    const [result, total] = await this.findAndCount({
      take: perPage,
      skip: perPage * (page - 1),
      where: {
        mode: POST_MODE_CONDITION.PUBLIC,
        tags: Like(`%${tag}%`),
      },
    });
    return {
      data: result,
      total,
    };
  }

  savePost(post: PostRequest, author: UserEntity, tags?: TagEntity[]) {
    return this.save({
      ...post,
      author,
      tags,
    });
  }

  deletePost(postId: string) {
    return this.softDelete(postId);
  }

  getLink(postId: string) {
    return this.findOne({
      select: ['link'],
      where: {
        id: postId,
      },
    });
  }
}
