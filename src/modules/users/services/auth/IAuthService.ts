import { injectable } from 'inversify';

export interface IContext {
  userId: any;
  email?: string;
  role?: string;
}

@injectable()
export abstract class IAuthService {
  abstract decodeAuthToken(...args): Promise<IContext>;
  abstract createUser(...args): Promise<any>;
  abstract updateUser(...args): Promise<any>;
  abstract deleteUser(...args): Promise<any>;
}
