import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Tag1648869555162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tag',
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
            name: 'name',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
