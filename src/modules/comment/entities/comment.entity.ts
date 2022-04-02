import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { PostEntity } from '../../post/entities/post.entity';
import { UserEntity } from 'src/modules/auth/entities';
import { IsNotEmpty } from 'class-validator';

@Entity('comment')
export class CommentEntity extends BaseEntity {
  @ManyToOne(() => UserEntity)
  user!: UserEntity;

  @ManyToOne(() => PostEntity)
  post!: PostEntity;

  @ManyToOne(() => PostEntity)
  parent?: CommentEntity;

  @IsNotEmpty()
  @Column()
  content!: string;
}
