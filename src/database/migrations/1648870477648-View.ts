import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class View1648870477648 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'view',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'post',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'createdAt',
            default: 'now()',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'updatedAt',
            default: 'now()',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'deletedAt',
            default: null,
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'view',
      new TableForeignKey({
        columnNames: ['user'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
    );
    await queryRunner.createForeignKey(
      'view',
      new TableForeignKey({
        columnNames: ['post'],
        referencedTableName: 'post',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
