import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { PostEntity } from './post.entity';

@Entity('tag')
export class TagEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;
}
