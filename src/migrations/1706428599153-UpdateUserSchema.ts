import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserSchema1706428599153 implements MigrationInterface {
  name = 'UpdateUserSchema1706428599153';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "users"."hash" IS 'Hash password'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`COMMENT ON COLUMN "users"."hash" IS NULL`);
  }
}
