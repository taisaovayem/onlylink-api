import { Injectable } from '@nestjs/common';
import {
  PostgresTransactionalRepository,
  PostgresUnitOfWork,
} from 'src/database/unit-of-work/postgres';
import { LikeEntity, PostEntity, TagEntity, ViewEntity } from '../entities';
import { PostRepository, TagRepository, ViewRepository } from '../repository';
import { LikeRepository } from '../repository/like.repository';
import { POST_MODE_CONDITION } from '../constants';
import { PostRequest } from '../dtos';
import { UserEntity } from 'src/modules/auth/entities';
import { UserRepository } from 'src/modules/auth/repository';

@Injectable()
export class PostService {
  constructor(
    private pgTransactionRepo: PostgresTransactionalRepository,
    private postgrestUnitOfWork: PostgresUnitOfWork,
  ) {}

  get postRepository(): PostRepository {
    return this.pgTransactionRepo.getRepository<PostEntity>(
      PostEntity,
    ) as PostRepository;
  }
  get tagRepository(): TagRepository {
    return this.pgTransactionRepo.getRepository<TagEntity>(
      TagEntity,
    ) as TagRepository;
  }
  get viewRepository(): ViewRepository {
    return this.pgTransactionRepo.getRepository<ViewEntity>(
      ViewEntity,
    ) as ViewRepository;
  }
  get likeRepository(): LikeRepository {
    return this.pgTransactionRepo.getRepository<LikeEntity>(
      LikeEntity,
    ) as LikeRepository;
  }
  get userRepository(): UserRepository {
    return this.pgTransactionRepo.getRepository<UserEntity>(
      UserEntity,
    ) as UserRepository;
  }

  hideDomain(domain: string) {
    const arr = domain.split('');
    for (let i = 2; i < arr.length; i++) {
      arr[i] = '*';
    }
    return arr.join('');
  }

  hideLink(link: string) {
    const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)/; // only get origin
    const linkSplit = link.match(regex)[0].split('.');
    if (linkSplit[0].includes('www')) {
      linkSplit[1] = this.hideDomain(linkSplit[1]).concat('***');
    } else {
      linkSplit[0] = this.hideDomain(linkSplit[0]).concat('***');
    }
    return linkSplit.join('.');
  }

  getLink(postId: string) {
    return this.postRepository.getLink(postId);
  }

  async getPost(postId: string) {
    const post = await this.postRepository.getPost(postId);
    const view = await this.viewRepository.count({
      where: {
        post,
      },
    });
    const like = await this.likeRepository.likeByPost(post);
    if (post.link) {
      post.link = this.hideLink(post.link);
    }
    return {
      ...post,
      view,
      like,
    };
  }

  getPostByUser(userId: string, page: number = 1, perPage: number = 10) {
    return this.postRepository.getPostByUser(
      userId,
      POST_MODE_CONDITION.PUBLIC,
      page,
      perPage,
    );
  }

  getMyPost(
    userId: string,
    page: number = 1,
    perPage: number = 10,
    mode?: POST_MODE_CONDITION,
  ) {
    return this.postRepository.getPostByUser(
      userId,
      mode ?? POST_MODE_CONDITION.ALL,
      page,
      perPage,
    );
  }

  async savePost(post: PostRequest, userId: string) {
    this.postgrestUnitOfWork.setIsolationLevel('SERIALIZABLE');
    return this.postgrestUnitOfWork.withTransaction(async () => {
      const user = await this.userRepository.findOne(userId);
      const tags = await Promise.all(
        post.tags.map(async (tagName: string) => {
          const found = await this.tagRepository.getTagByName(tagName);
          if (found) {
            return found;
          } else {
            return await this.tagRepository.saveTag(tagName);
          }
        }),
      );
      return this.postRepository.savePost(post, user, tags);
    });
  }

  deletePost(postId: string) {
    return this.postRepository.deletePost(postId);
  }
}
