import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { IsEmail } from 'class-validator';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
