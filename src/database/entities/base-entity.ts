import { PrimaryGeneratedColumn, Generated } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id: string;
}
