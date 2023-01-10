import { Injectable } from '@nestjs/common';
import {
  PostgresTransactionalRepository,
  PostgresUnitOfWork,
} from 'src/database/unit-of-work/postgres';
import { UserEntity } from 'src/modules/auth/entities';
import { UserRepository } from 'src/modules/auth/repositories';
import { PostEntity } from 'src/modules/post/entities';
import { PostRepository } from 'src/modules/post/repositories';
import { ListRequest } from '../dtos/request';
import { ListEntity, ListItemEntity } from '../entities';
import { ListItemRepository, ListRepository } from '../repositories';
import {
  AddToListError,
  DeleteListError,
  NotFoundError,
  NotFoundPostError,
  NotPermissonAddToListError,
  NotPermissonDeleteListError,
  NotPermissonEditListError,
  NotPermissonViewListError,
} from '../errors';
import { LIST_MODE, LIST_MODE_CONDITION } from '../constants';
import { getUserInfo } from 'src/modules/auth/helpers';

@Injectable()
export class ListService {
  constructor(
    private pgTransactionRepo: PostgresTransactionalRepository,
    private pgUnitOfWork: PostgresUnitOfWork,
  ) {}

  get listRepository(): ListRepository {
    return this.pgTransactionRepo.getRepository<ListEntity>(
      ListRepository,
    ) as ListRepository;
  }
  get listItemRepository(): ListItemRepository {
    return this.pgTransactionRepo.getRepository<ListItemEntity>(
      ListItemRepository,
    ) as ListItemRepository;
  }
  get listUserRepository(): UserRepository {
    return this.pgTransactionRepo.getRepository<UserEntity>(
      UserRepository,
    ) as UserRepository;
  }
  get postRepository(): PostRepository {
    return this.pgTransactionRepo.getRepository<PostEntity>(
      PostRepository,
    ) as PostRepository;
  }

  async getListInfo(userId: string, listId: string) {
    const list = await this.listRepository.getListInfo(listId);
    if (list.user.id !== userId && list.mode === LIST_MODE.PRIVATE) {
      return new NotPermissonViewListError();
    }
    return { ...list, user: getUserInfo(list.user) };
  }

  async addList(list: ListRequest, userId: string) {
    const user = await this.listUserRepository.findOne(userId);
    const newList = await this.listRepository.saveList(list, user);
    return { ...newList, user: getUserInfo(newList.user) };
  }

  async editList(list: ListRequest, userId: string) {
    const listResult = await this.listRepository.findOne(list.id, {
      relations: ['user'],
    });
    if (!listResult || listResult.user.id !== userId) {
      return new NotPermissonEditListError();
    }
    const newList = await this.listRepository.saveList(list, listResult.user);
    return { ...newList, user: getUserInfo(newList.user) };
  }

  async deleteList(listId: string, userId: string) {
    const listResult = await this.listRepository.findOne(listId, {
      relations: ['user'],
    });
    if (!listResult || listResult.user.id !== userId) {
      return new NotPermissonDeleteListError();
    }

    return this.pgUnitOfWork.withTransaction(async () => {
      await this.listItemRepository.softDelete({ list: listResult });
      const result = await this.listRepository.deleteList(listId);
      if (result.affected === 1) return { status: 200 };
      return new DeleteListError();
    });
  }

  async getMyList(userId: string, page: number = 1, perPage: number = 10) {
    const user = await this.listUserRepository.findOne(userId);
    const { data, total } = await this.listRepository.getLists(
      user,
      LIST_MODE_CONDITION.ALL,
      page,
      perPage,
    );
    return {
      data: data.map((list: ListEntity) => ({
        ...list,
        user: getUserInfo(list.user),
      })),
      total,
    };
  }

  async getListByUser(userId: string, page: number = 1, perPage: number = 10) {
    const user = await this.listUserRepository.findOne(userId);
    const { data, total } = await this.listRepository.getLists(
      user,
      LIST_MODE_CONDITION.PUBLIC,
      page,
      perPage,
    );
    return {
      data: data.map((list: ListEntity) => ({
        ...list,
        user: getUserInfo(list.user),
      })),
      total,
    };
  }

  async addRemoveToList(userId: string, listId: string, postId: string) {
    const list = await this.listRepository.findOne(listId, {
      relations: ['user'],
    });
    if (!list) return new NotFoundError();
    if (list.user.id !== userId) return new NotPermissonAddToListError();
    const post = await this.postRepository.findOne(postId);
    if (!post) return new NotFoundPostError();
    const listItem = await this.listItemRepository.findOne({
      where: { post, list },
    });
    if (listItem) {
      const result = await this.listItemRepository.removeFromList(post, list);
      console.log('result', result);
      if (result.affected >= 1) {
        return { status: 200 };
      }
      return new AddToListError();
    }
    return this.listItemRepository.addToList(post, list);
  }

  async getPosts(
    userId: string,
    listId: string,
    page: number = 1,
    perPage: number = 10,
  ) {
    const list = await this.listRepository.findOne(listId, {
      relations: ['user'],
    });
    if (!list) return new NotFoundError();
    if (list.user.id !== userId && list.mode === LIST_MODE.PRIVATE)
      return new NotPermissonViewListError();
    return this.listItemRepository.getPosts(userId, listId, page, perPage);
  }
}
