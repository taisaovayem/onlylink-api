import { Injectable } from '@nestjs/common';
import { PostgresTransactionalRepository } from 'src/database/unit-of-work/postgres';
import { UserEntity } from 'src/modules/auth/entities';
import { UserRepository } from 'src/modules/auth/repositories';
import { PostEntity } from 'src/modules/post/entities';
import { PostRepository } from 'src/modules/post/repositories';
import { CommentRequest } from '../dtos';
import { CommentEntity } from '../entities';
import {
  CommentError,
  NoPostFoundError,
  NotPermissonDeleteError,
  NotPermissonEditError,
} from '../errors';
import { CommentRepository } from '../repositories';

@Injectable()
export class CommentService {
  constructor(private pgTransactionRepo: PostgresTransactionalRepository) {}

  get commentRepository(): CommentRepository {
    return this.pgTransactionRepo.getRepository<CommentEntity>(
      CommentRepository,
    ) as CommentRepository;
  }
  get userRepository(): UserRepository {
    return this.pgTransactionRepo.getRepository<UserEntity>(
      UserRepository,
    ) as UserRepository;
  }
  get postRepository(): PostRepository {
    return this.pgTransactionRepo.getRepository<PostEntity>(
      PostRepository,
    ) as PostRepository;
  }

  async getComments(postId: string, page: number = 1, perPage: number = 10) {
    const post = await this.postRepository.getPost(postId);
    if (!post) return new NoPostFoundError();
    return this.commentRepository.getComments(post, page, perPage);
  }

  async addComment(comment: CommentRequest, userId: string) {
    const post = await this.postRepository.getPost(comment.post);
    const user = await this.userRepository.findOne(userId);
    if (!post) return new NoPostFoundError();
    return this.commentRepository.addComment(comment, post, user);
  }

  async editComment(
    commentId: string,
    comment: CommentRequest,
    userId: string,
  ) {
    const commnetData = await this.commentRepository.findOne(commentId, {
      relations: ['user'],
    });
    if (commnetData.user.id !== userId) return new NotPermissonEditError();
    return this.commentRepository.updateComment(commentId, {
      ...commnetData,
      content: comment.content,
    } as unknown as CommentRequest);
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentRepository.findOne(commentId, {
      relations: ['user'],
    });
    if (comment.user.id !== userId) return new NotPermissonDeleteError();
    const result = await this.commentRepository.deleteComment(commentId);
    if (result.affected === 1) return { status: 200 };
    return new CommentError();
  }
}
