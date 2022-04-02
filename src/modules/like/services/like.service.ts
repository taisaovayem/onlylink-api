import { Injectable } from '@nestjs/common';
import { PostgresTransactionalRepository } from 'src/database/unit-of-work/postgres';
import { UserEntity } from 'src/modules/auth/entities';
import { UserRepository } from 'src/modules/auth/repositories';
import { POST_MODE_CONDITION } from 'src/modules/post/constants';
import { PostEntity } from 'src/modules/post/entities';
import { PostRepository } from 'src/modules/post/repositories';
import { LikeEntity } from '../entities';
import { InvalidInformationError } from '../errors';
import { LikeRepository } from '../repositories';

@Injectable()
export class LikeService {
  constructor(private pgTransactionRepo: PostgresTransactionalRepository) {}

  get likeRepository(): LikeRepository {
    return this.pgTransactionRepo.getRepository<LikeEntity>(
      LikeRepository,
    ) as LikeRepository;
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

  async likeUnlike(postId: string, userId: string) {
    console.log('aaa', this.likeRepository);
    const liked = await this.likeRepository.findOne({
      where: {
        user: userId,
        post: postId,
      },
    });
    const user = await this.userRepository.findOne(userId);
    const post = await this.postRepository.findOne(postId);
    if (!user || !post) return new InvalidInformationError();
    if (liked) {
      const result = await this.likeRepository.removeLike(
        userId as unknown as UserEntity,
        postId as unknown as PostEntity,
      );
      if (result.affected === 1) return { status: 200 };
    }
    return this.likeRepository.addLike(
      userId as unknown as UserEntity,
      postId as unknown as PostEntity,
    );
  }
}
