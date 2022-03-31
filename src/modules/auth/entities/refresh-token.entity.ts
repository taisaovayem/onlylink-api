import {
  Entity,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { UserEntity } from './user.entity';

@Entity('refresh_token')
export class RefreshTokenEntity extends BaseEntity {
  @Column()
  token: string;

  @Column()
  expired: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
