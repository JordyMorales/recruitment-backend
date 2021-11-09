import { injectable } from 'inversify';
import { User } from '../../domain/user';
import { UserId } from '../../domain/userId';
import { UserMap } from '../mappers/userMap';
import { UserEmail } from '../../domain/userEmail';
import { IUserRepo } from '../../domain/ports/userRepo';
import models from '../../../../shared/infra/database/sequelize/models';

@injectable()
export class UserRepo implements IUserRepo {
  private models: any;
  constructor() {
    this.models = models;
  }

  async exists(userEmail: UserEmail): Promise<boolean> {
    const UserModel = this.models.User;
    const userFound = await UserModel.findOne({
      where: { email: userEmail.value },
    });
    return !!userFound === true;
  }
  async getUserById(userId: UserId): Promise<User> {
    const UserModel = this.models.User;
    const userFound = await UserModel.findByPk(userId.id.toString());
    if (!!userFound === false) throw new Error('User not found.');
    return UserMap.toDomain(userFound);
  }
  async getAllUsers(): Promise<User[]> {
    const UserModel = this.models.User;
    const users = await UserModel.findAll();
    return users.map((employee) => UserMap.toDomain(employee));
  }
  async save(user: User): Promise<void> {
    const UserModel = this.models.User;
    const exists = await this.exists(user.email);
    if (!exists) {
      const rawSequelizeUser = await UserMap.toPersistence(user);
      await UserModel.create(rawSequelizeUser);
    }
    return;
  }
  async update(user: User): Promise<void> {
    const UserModel = this.models.User;
    const userFound = await this.getUserById(user.userId);
    const exists = !!userFound === true;
    if (exists) {
      const rawSequelizeUser = await UserMap.toPersistence(user);
      await UserModel.update(rawSequelizeUser, {
        where: { user_id: user.userId.id.toString() },
      });
    }
    return;
  }
}
