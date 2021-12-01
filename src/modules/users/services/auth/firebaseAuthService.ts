import { injectable } from 'inversify';
import { User } from '../../domain/user';
import { IAuthService, IContext } from './IAuthService';
import admin from '../../../../shared/infra/firebase';

export interface IFirebaseProvider extends IAuthService {
  decodeAuthToken(idToken: string): Promise<IContext>;
  createUser(user: User): Promise<boolean>;
  updateUser(user: User): Promise<void>;
  deleteUser(user: User): Promise<boolean>;
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

  public async createUser(user: User): Promise<boolean> {
    try {
      const { id, firstName, lastName, password, email, role, state, photoUrl } = user;

      const userRecord = await admin.auth().createUser({
        uid: id.toString(),
        displayName: `${firstName} ${lastName}`,
        password: password.props.value,
        email: email.props.value,
        disabled: state !== 'ACTIVE',
        ...(photoUrl && { photoURL: photoUrl }),
      });
      await admin.auth().setCustomUserClaims(userRecord.uid, { role });
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async updateUser(user: User): Promise<void> {
    try {
      const { id, firstName, lastName, email, role, state, photoUrl } = user;

      await admin.auth().updateUser(id.toString(), {
        displayName: `${firstName} ${lastName}`,
        email: email.props.value,
        disabled: state !== 'ACTIVE',
        ...(photoUrl && { photoURL: photoUrl }),
      });
      await admin.auth().setCustomUserClaims(id.toString(), { role });
    } catch (error) {
      throw new Error(error.message);
    }
  }

  public async deleteUser(user: User): Promise<boolean> {
    try {
      await admin.auth().deleteUser(user.id.toString());
      return true;
    } catch (error) {
      return false;
    }
  }
}
