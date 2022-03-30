import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { UserEntity } from './user.entity';

@Entity('refresh_token')
export class RefreshTokenEntity extends BaseEntity {
  @Column({ unique: true })
  token: string;

  @Column()
  expired: Date;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  deletedAt: Date;
}
