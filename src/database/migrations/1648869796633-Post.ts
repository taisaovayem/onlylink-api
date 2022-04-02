import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Post1648869796633 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'post',
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
            name: 'code',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'link',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'authorId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'mode',
            type: 'varchar',
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
      'post',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
