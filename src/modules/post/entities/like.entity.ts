import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { PostEntity } from './post.entity';
import { UserEntity } from 'src/modules/auth/entities';

@Entity('like')
export class LikeEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => PostEntity)
  post!: PostEntity;
}
