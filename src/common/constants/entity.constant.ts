import { registerEnumType } from '@nestjs/graphql';
import { EnumMetadataValuesMapOptions } from '@nestjs/graphql/dist/schema-builder/metadata';
import { ActionEnum } from '@permissions/enums/action.enum';

export enum EntityEnum {
  AUTH = 'AUTH',
  USERS = 'USERS',
  ROLES = 'ROLES',
  PERMISSIONS = 'PERMISSIONS',
}

export const MAPPING_ENTITY_DESCRIPTION: Partial<Record<EntityEnum, EnumMetadataValuesMapOptions>> = {
  [EntityEnum.USERS]: {
    description: 'Users resource',
  },
  [EntityEnum.ROLES]: {
    description: 'Roles resource',
  },
};

registerEnumType(EntityEnum, {
  name: 'EntityEnum',
  description: 'Entities set permissions',
  valuesMap: MAPPING_ENTITY_DESCRIPTION,
});

export interface IRouteInfo {
  entity?: EntityEnum;
  action: ActionEnum;
}

export const MAPPING_GQL_OPS_TO_ENTITY_ACTION: Record<string, IRouteInfo> = {
  getUsers: {
    entity: EntityEnum.USERS,
    action: ActionEnum.READ,
  },
};
