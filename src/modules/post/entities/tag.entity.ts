import {
  Entity,
  Column,
} from 'typeorm';
import { BaseEntity } from 'src/database/entities';

@Entity('post')
export class TagEntity extends BaseEntity {
  @Column({ unique: true })
  name!: string;
}
