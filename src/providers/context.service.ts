import * as requestContext from 'request-context';
import { PermissionEntity } from '@permissions/permission.entity';
import { UserDto } from '@users/dto/user.dto';

export interface IRequestInfo {
  ipAddress: string;
  location: string;
  userAgent: string;
}

export class ContextService {
  private static readonly _nameSpace = 'request';
  private static _authUserKey = 'user_key';
  private static _authUserToken = 'user_access_token';
  private static _authUserEmail = 'user_email';
  private static _entity = 'entity';
  private static _permissions = 'permissions';
  private static _authUserInfo = 'auth_user_info';

  static get<T>(key: string): T {
    return requestContext.get(ContextService._getKeyWithNamespace(key));
  }

  static set(key: string, value: any): void {
    requestContext.set(ContextService._getKeyWithNamespace(key), value);
  }

  private static _getKeyWithNamespace(key: string): string {
    return `${ContextService._nameSpace}.${key}`;
  }

  static setRolesContext(roles: { id: number; name: string }[]): void {
    ContextService.set('roleContext', roles);
  }

  static getRolesContext(): { id: number; name: string }[] {
    return ContextService.get('roleContext');
  }

  static setPermissions(permissions: PermissionEntity[]): void {
    ContextService.set(this._permissions, permissions);
  }

  static getPermissions(): any {
    return ContextService.get(this._permissions);
  }

  static setRequestInfo(info: IRequestInfo): void {
    ContextService.set('requestInfo', info);
  }

  static getRequestInfo(): IRequestInfo {
    return ContextService.get('requestInfo');
  }

  static setAuthUser(id: string): void {
    ContextService.set(this._authUserKey, id);
  }

  static getAuthUser(): string {
    return ContextService.get(this._authUserKey);
  }

  static setAuthAccessToken(id: string): void {
    ContextService.set(this._authUserToken, id);
  }

  static getAuthAccessToken(): string {
    return ContextService.get(this._authUserToken);
  }

  static setAuthUserEmail(email: string): void {
    ContextService.set(this._authUserEmail, email);
  }

  static getAuthUserEmail(): string {
    return ContextService.get(this._authUserEmail);
  }

  static setEntity(entity: string): void {
    ContextService.set(this._entity, entity);
  }

  static getEntity(): string {
    return ContextService.get(this._entity);
  }

  static setAuthUserInfo(user: UserDto): void {
    return ContextService.set(this._authUserInfo, user);
  }

  static getAuthUserInfo(): UserDto {
    return ContextService.get(this._authUserInfo);
  }
}
