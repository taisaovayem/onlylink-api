import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { PostEntity } from './post.entity';
import { TagEntity } from './tag.entity';

@Entity('tag_relation_post')
export class TagRelationPostEntity extends BaseEntity {
  @ManyToOne(() => PostEntity)
  @JoinColumn()
  post!: PostEntity;

  @ManyToOne(() => TagEntity)
  @JoinColumn()
  tag!: TagEntity;
}
