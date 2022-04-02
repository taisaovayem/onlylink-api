import { BaseRepository } from 'src/database/repositories';
import { PostEntity } from 'src/modules/post/entities';
import { EntityRepository } from 'typeorm';
import { CommentEntity } from '../entities';
import { getUserInfo } from 'src/modules/auth/helpers';
import { UserEntity } from 'src/modules/auth/entities';
import { CommentRequest } from '../dtos';

@EntityRepository(CommentEntity)
export class CommentRepository extends BaseRepository<CommentEntity> {
  async getComments(post: PostEntity, page: number = 1, perPage: number = 10) {
    const [result, total] = await this.findAndCount({
      where: {
        post,
      },
      take: perPage,
      skip: perPage * (page - 1),
      relations: ['user'],
    });
    return {
      data: result.map((comment: CommentEntity) => ({
        ...comment,
        user: getUserInfo(comment.user),
      })),
      total,
    };
  }

  addComment(comment: CommentRequest, post: PostEntity, user: UserEntity) {
    return this.save({
      content: comment.content,
      post,
      user,
    });
  }

  async updateComment(id: string, comment: CommentRequest) {
    const commentRecord = await this.findOne(id);
    return this.save({
      ...commentRecord,
      content: comment.content,
    });
  }

  deleteComment(id: string) {
    return this.softDelete(id);
  }
}
