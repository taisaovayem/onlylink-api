import { Entity, Column, ManyToOne, JoinColumn, AfterLoad } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { UserEntity } from 'src/modules/auth/entities';
import { POST_MODE } from '../constants';

@Entity('post')
export class PostEntity extends BaseEntity {
  @Column()
  code?: string;

  @Column()
  link?: string;

  @Column()
  description?: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  author!: Omit<UserEntity, 'password'>;

  @Column()
  mode!: POST_MODE;

  @Column()
  tags?: string;
}
