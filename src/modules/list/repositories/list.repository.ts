import { BaseRepository } from 'src/database/repositories';
import { EntityRepository } from 'typeorm';
import { ListEntity } from '../entities';
import { ListRequest } from '../dtos/request';
import { UserEntity } from 'src/modules/auth/entities';
import { LIST_MODE, LIST_MODE_CONDITION } from '../constants';

@EntityRepository(ListEntity)
export class ListRepository extends BaseRepository<ListEntity> {
  saveList(list: ListRequest, user: UserEntity) {
    return this.save({ ...list, user });
  }

  async getLists(
    user: UserEntity,
    mode: LIST_MODE_CONDITION,
    page: number = 1,
    perPage: number = 10,
  ) {
    if (mode === LIST_MODE_CONDITION.ALL) {
      const [result, total] = await this.findAndCount({
        take: perPage,
        skip: perPage * (page - 1),
        where: {
          user,
        },
        relations: ['user'],
        order: {
          createdAt: 'DESC',
        }
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
        user,
        mode,
      },
      relations: ['user'],
    });
    return {
      data: result,
      total,
    };
  }

  getListInfo(listId: string) {
    return this.findOne(listId, {
      relations: ['user'],
    });
  }

  deleteList(listId: string) {
    return this.softDelete(listId);
  }
}
