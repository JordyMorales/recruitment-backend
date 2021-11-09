import { injectable } from 'inversify';
import { User } from '../user';
import { UserId } from '../userId';
import { UserEmail } from '../userEmail';

@injectable()
export abstract class IUserRepo {
  abstract exists(userEmail: UserEmail): Promise<boolean>;
  abstract getUserById(userId: UserId): Promise<User>;
  abstract getAllUsers(): Promise<User[]>;
  abstract save(user: User): Promise<void>;
  abstract update(user: User): Promise<void>;
}
