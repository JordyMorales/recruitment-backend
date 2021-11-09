import { injectable } from 'inversify';
import { User } from '../../domain/user';
import { IAuthService, IContext } from '../authService';
import admin from '../../../../shared/infra/firebase';

export interface IFirebaseProvider extends IAuthService {
  decodeAuthToken(idToken: string): Promise<IContext>;
  createUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
}

@injectable()
export class FirebaseAuthService implements IFirebaseProvider {
  public async decodeAuthToken(idToken: string): Promise<IContext> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return {
        userId: decodedToken.uid,
        role: decodedToken.role,
        email: decodedToken.email,
      };
    } catch (error: any) {
      switch (error.code) {
        case 'auth/id-token-expired':
          throw new Error('Access token has expired');
        case 'auth/argument-error':
          throw new Error('Invalid access token');
        default:
          throw new Error(error.message);
      }
    }
  }

  public async createUser(user: User): Promise<void> {
    try {
      const { id, firstName, lastName, password, email, role } = user;

      const userRecord = await admin.auth().createUser({
        uid: id.toString(),
        displayName: `${firstName} ${lastName}`,
        password: password.props.value,
        email: email.props.value,
      });
      await admin.auth().setCustomUserClaims(userRecord.uid, { role });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updateUser(user: User): Promise<void> {
    try {
      const { id, firstName, lastName, email, role } = user;

      await admin.auth().updateUser(id.toString(), {
        displayName: `${firstName} ${lastName}`,
        email: email.props.value,
      });
      await admin.auth().setCustomUserClaims(id.toString(), { role });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
