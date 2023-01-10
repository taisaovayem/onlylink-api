import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/database/entities';
import { UserEntity } from 'src/modules/auth/entities';
import { LIST_MODE } from '../constants';

@Entity('list')
export class ListEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column({nullable: true})
  description?: string;

  @Column()
  mode!: LIST_MODE;

  @ManyToOne(() => UserEntity)
  user!: UserEntity;
}
