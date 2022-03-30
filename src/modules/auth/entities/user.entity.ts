import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/database/entities';

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;
}
