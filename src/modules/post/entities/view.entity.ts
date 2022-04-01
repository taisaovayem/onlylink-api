import { JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { PostEntity } from './post.entity';
import { UserEntity } from 'src/modules/auth/entities';

export class ViewEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => PostEntity)
  @JoinColumn()
  post: PostEntity;
}
