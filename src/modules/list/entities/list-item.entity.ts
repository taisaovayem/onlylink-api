import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { ListEntity } from './list.entity';
import { PostEntity } from 'src/modules/post/entities';

@Entity('list_item')
export class ListItemEntity extends BaseEntity {
  @ManyToOne(() => ListEntity)
  list!: ListEntity;

  @ManyToOne(() => PostEntity)
  post!: PostEntity;
}
