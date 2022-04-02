import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { IsEmail } from 'class-validator';
import { UserStatus } from '../constants';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @Column()
  name!: string;

  @Column()
  password!: string;

  @Column()
  status!: UserStatus;
}
