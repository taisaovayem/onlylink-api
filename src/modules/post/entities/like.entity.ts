import { Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { PostEntity } from './post.entity';
import { UserEntity } from 'src/modules/auth/entities';

@Entity('like')
export class LikeEntity extends BaseEntity {
  @ManyToMany(() => UserEntity)
  user!: UserEntity;

  @ManyToMany(() => PostEntity)
  post!: PostEntity;
}
