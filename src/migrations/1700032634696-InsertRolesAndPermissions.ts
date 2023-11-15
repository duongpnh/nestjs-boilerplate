import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertRolesAndPermissions1700032634696 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO roles(id, name) VALUES(1, 'Admin'),(2, 'User');`);
    await queryRunner.query(`
        SELECT setval(pg_get_serial_sequence('roles', 'id'), MAX(id)) FROM "roles"
    `);
    await queryRunner.query(`
      ALTER TYPE "public"."permissions_entity_enum" ADD VALUE 'PERMISSIONS';
      COMMIT;
    `);

    await queryRunner.query(`
      INSERT INTO "public"."permissions" ("created_at", "updated_at", "deleted_at", "id", "name", "description", "action", "entity") VALUES
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 1, 'Read Permission', 'User can read the permissions', 'READ', 'PERMISSIONS'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 2, 'Create Permission', 'User can create a new permission', 'CREATE', 'PERMISSIONS'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 3, 'Update Permission', 'User can update a permission', 'UPDATE', 'PERMISSIONS'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 4, 'Delete Permission', 'User can delete a permission', 'DELETE', 'PERMISSIONS'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 5, 'Restore Permission', 'User can restore a deleted permission', 'RESTORE', 'PERMISSIONS'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 6, 'Read Role', 'User can read the roles', 'READ', 'ROLES'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 7, 'Create Role', 'User can create a new role', 'CREATE', 'ROLES'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 8, 'Update Role', 'User can update a role', 'UPDATE', 'ROLES'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 9, 'Delete Role', 'User can delete a role', 'DELETE', 'ROLES'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 10, 'Restore Role', 'User can restore a deleted role', 'RESTORE', 'ROLES'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 11, 'Read User', 'User can read the users', 'READ', 'USERS'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 12, 'Create User', 'User can create a new user', 'CREATE', 'USERS'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 13, 'Update User', 'User can update an user', 'UPDATE', 'USERS'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 14, 'Delete User', 'User can delete an user', 'DELETE', 'USERS'),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 15, 'Restore User', 'User can restore a deleted user', 'RESTORE', 'USERS');
    `);
    await queryRunner.query(`
      SELECT setval(pg_get_serial_sequence('permissions', 'id'), MAX(id)) FROM "permissions"
    `);

    await queryRunner.query(`
      INSERT INTO "public"."role_permission" ("created_at", "updated_at", "deleted_at", "role_id", "permission_id") VALUES
      ('2023-10-30 16:39:00.252671', '2023-10-30 16:39:00.252671', NULL, 1, 1),
      ('2023-10-30 16:39:00.252671', '2023-10-30 16:39:00.252671', NULL, 1, 2),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 3),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 4),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 5),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 6),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 7),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 8),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 9),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 10),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 11),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 12),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 13),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 14),
      ('2023-10-30 16:39:57.518313', '2023-10-30 16:39:57.518313', NULL, 1, 15),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 2, 6),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 2, 11),
      ('2023-10-30 16:31:57.436741', '2023-10-30 16:31:57.436741', NULL, 2, 13);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM role_permission;`);
    await queryRunner.query(`DELETE FROM roles;`);
    await queryRunner.query(`DELETE FROM permissions`);
  }
}
