import { Injectable } from '@nestjs/common';
import {
  PostgresTransactionalRepository,
  PostgresUnitOfWork,
} from 'src/database/unit-of-work/postgres';
import { LikeEntity, PostEntity, TagEntity, ViewEntity } from '../entities';
import { PostRepository, TagRepository, ViewRepository } from '../repository';
import { LikeRepository } from '../repository/like.repository';
import { POST_MODE_CONDITION } from '../constants';
import { PostRequest, PostResponse } from '../dtos';
import { UserEntity } from 'src/modules/auth/entities';
import { UserRepository } from 'src/modules/auth/repository';
import { CacheService } from 'src/shared/cache';
import { NotPermissionViewError } from '../errors';
import { hideLink } from '../helpers';

const CACHE_5_MINUTES = 5;

@Injectable()
export class PostService {
  constructor(
    private pgTransactionRepo: PostgresTransactionalRepository,
    private postgrestUnitOfWork: PostgresUnitOfWork,
    private cacheService: CacheService,
  ) {}

  get postRepository(): PostRepository {
    return this.pgTransactionRepo.getRepository<PostEntity>(
      PostRepository,
    ) as PostRepository;
  }
  get tagRepository(): TagRepository {
    return this.pgTransactionRepo.getRepository<TagEntity>(
      TagRepository,
    ) as TagRepository;
  }
  get viewRepository(): ViewRepository {
    return this.pgTransactionRepo.getRepository<ViewEntity>(
      ViewRepository,
    ) as ViewRepository;
  }
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

  async getLink(postId: string, userId: string) {
    const getLink = async (postId: string) => {
      const linkCached = await this.cacheService.getObject(`link_${postId}`);
      if (linkCached) return linkCached as PostEntity;
      const link = await this.postRepository.getLink(postId);
      this.cacheService.setObject(`link_${postId}`, link);
      return link;
    };
    const post = await getLink(postId);
    if (post.author.id !== userId) {
      return new NotPermissionViewError();
    }
    return { link: post.link };
  }

  async getPost(postId: string, userId: string) {
    const getPost = async (postId: string) => {
      const postCached = (await this.cacheService.getObject(
        `post_${postId}`,
      )) as PostEntity;
      if (postCached) return postCached;
      const post = await this.postRepository.getPost(postId);
      this.cacheService.setObject(`post_${postId}`, post);
      return post;
    };
    const post = await getPost(postId);
    if (post.author.id !== userId) {
      return new NotPermissionViewError();
    }

    const getView = async (post: PostEntity) => {
      const viewCached = +(await this.cacheService.get(
        `view_${post.id}`,
      )) as number;
      if (viewCached) return viewCached;
      const view = await this.viewRepository.count({
        where: {
          post,
        },
      });
      this.cacheService.set(
        `view_${post.id}`,
        view.toString(),
        CACHE_5_MINUTES,
      );
      return view;
    };
    const view = await getView(post);

    const getLike = async (post: PostEntity) => {
      const likeCached = +(await this.cacheService.get(
        `like_${post.id}`,
      )) as number;
      if (likeCached) return likeCached;
      const like = await this.likeRepository.likeByPost(post);
      this.cacheService.set(
        `like_${post.id}`,
        like.toString(),
        CACHE_5_MINUTES,
      );
      return like;
    };
    const like = await getLike(post);

    if (post.link) {
      post.link = hideLink(post.link);
    }

    const addView = async () => {
      const user = await this.userRepository.findOne(userId);
      this.viewRepository.addView(post, user);
    };
    addView();

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
      const newPost = await this.postRepository.savePost(post, user, tags);
      this.cacheService.setObject(`post_${newPost.id}`, newPost);
      return newPost;
    });
  }

  async getPostByTag(tag: string, page: number = 1, perPage: number = 10) {
    const tagEntity = await this.tagRepository.getTag(tag);
    return this.postRepository.getPostByTag(tagEntity, page, perPage);
  }

  deletePost(postId: string) {
    this.cacheService.delete(`post_${postId}`);
    return this.postRepository.deletePost(postId);
  }
}
