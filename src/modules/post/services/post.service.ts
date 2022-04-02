import { Injectable } from '@nestjs/common';
import {
  PostgresTransactionalRepository,
  PostgresUnitOfWork,
} from 'src/database/unit-of-work/postgres';
import { PostEntity, TagEntity, ViewEntity } from '../entities';
import { LikeEntity } from 'src/modules/like/entities';
import { PostRepository, TagRepository, ViewRepository } from '../repositories';
import { LikeRepository } from 'src/modules/like/repositories';
import { POST_MODE, POST_MODE_CONDITION } from '../constants';
import { PostRequest } from '../dtos';
import { UserEntity } from 'src/modules/auth/entities';
import { UserRepository } from 'src/modules/auth/repositories';
import { CacheService } from 'src/shared/cache';
import {
  DeleteError,
  NotPermissionViewError,
  NotPermissonDeleteError,
} from '../errors';
import { getUserInfo } from 'src/modules/auth/helpers';

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

  async mapPost(post: PostEntity) {
    /** map tags id to tags entity in post object */
    if (!post.tags) return post;
    const newPostTagsArr = JSON.parse(post.tags);
    const newPostTag = await Promise.all(
      newPostTagsArr.map(async (tagId: string) => {
        const tagCached = await this.cacheService.getObject(`tag_${tagId}`);
        if (tagCached) return tagCached;
        const tag = await this.tagRepository.getTag(tagId);
        this.cacheService.setObject(`tag_${tagId}`, tag);
        return tag;
      }),
    );
    const author = getUserInfo(post.author);
    return { ...post, author, tags: newPostTag };
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
    type PostMapped = {
      code?: string;
      link?: string;
      description?: string;
      author: UserEntity;
      mode: POST_MODE;
      tags?: TagEntity[];
    };
    const getPost = async (postId: string) => {
      const postCached = (await this.cacheService.getObject(
        `post_${postId}`,
      )) as PostMapped;
      if (postCached)
        return {
          post: postCached,
          postRaw: {
            ...postCached,
            tags: postCached.tags.map((tag) => tag.id),
          } as unknown as PostEntity,
        };

      const post = await this.postRepository.getPost(postId);
      const postMapped = await this.mapPost(post);
      this.cacheService.setObject(`post_${postId}`, postMapped);
      return { post: postMapped, postRaw: post };
    };
    const { post, postRaw } = await getPost(postId);
    if (post.author.id !== userId && post.mode === POST_MODE.PRIVATE) {
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
    const view = await getView(postRaw);

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
    const like = await getLike(postRaw);

    const addView = async () => {
      const user = await this.userRepository.findOne(userId);
      this.viewRepository.addView(postRaw, user);
    };
    addView();

    return {
      ...post,
      view,
      like,
    };
  }

  async getPostByUser(userId: string, page: number = 1, perPage: number = 10) {
    const posts = await this.postRepository.getPostByUser(
      userId,
      POST_MODE_CONDITION.PUBLIC,
      page,
      perPage,
    );
    return {
      data: await Promise.all(
        posts.data.map(async (post) => await this.mapPost(post)),
      ),
      total: posts.total,
    };
  }

  async getMyPost(
    userId: string,
    page: number = 1,
    perPage: number = 10,
    mode?: POST_MODE_CONDITION,
  ) {
    const posts = await this.postRepository.getPostByUser(
      userId,
      mode ?? POST_MODE_CONDITION.ALL,
      page,
      perPage,
    );
    return {
      data: await Promise.all(
        posts.data.map(async (post) => await this.mapPost(post)),
      ),
      total: posts.total,
    };
  }

  async savePost(post: PostRequest, userId: string) {
    this.postgrestUnitOfWork.setIsolationLevel('SERIALIZABLE');
    return this.postgrestUnitOfWork.withTransaction(async () => {
      const user = await this.userRepository.findOne(userId);
      const tags = post.tags
        ? await Promise.all(
            post.tags.map(async (tagName: string) => {
              const found = await this.tagRepository.getTagByName(tagName);
              if (found) {
                return found;
              } else {
                return await this.tagRepository.saveTag(tagName);
              }
            }),
          )
        : [];
      const newPost = await this.postRepository.savePost(post, user, tags);
      const newPostWithTags = await this.mapPost(newPost);
      this.cacheService.setObject(`post_${newPost.id}`, newPostWithTags);
      return newPostWithTags;
    });
  }

  async getPostByTag(tag: string, page: number = 1, perPage: number = 10) {
    const posts = await this.postRepository.getPostByTag(tag, page, perPage);
    return {
      data: await Promise.all(
        posts.data.map(async (post) => await this.mapPost(post)),
      ),
      total: posts.total,
    };
  }

  async deletePost(postId: string, userId: string) {
    const post = await this.postRepository.getPost(postId);
    if (post.author.id !== userId) {
      return new NotPermissonDeleteError();
    }
    if (post) this.cacheService.delete(`post_${postId}`);
    const deleted = await this.postRepository.deletePost(postId);
    if (deleted.affected === 1) {
      return { status: 200, message: 'Xóa thành công' };
    } else {
      return new DeleteError();
    }
  }

  async getPostLiked(userId: string, page: number, perPage: number) {
    const { data, total } = await this.likeRepository.likeByUser(
      userId,
      POST_MODE_CONDITION.ALL,
      page,
      perPage,
    );

    return {
      data: await Promise.all(
        data.map(async (post) => await this.mapPost(post)),
      ),
      total,
    };
  }
}
