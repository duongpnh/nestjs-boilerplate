import { registerEnumType } from '@nestjs/graphql';

export enum ActionEnum {
  READ = 'READ',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  RESTORE = 'RESTORE',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

registerEnumType(ActionEnum, { name: 'ActionEnum' });
