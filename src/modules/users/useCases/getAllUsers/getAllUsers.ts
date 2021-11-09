import { injectable, inject } from 'inversify';
import { User } from '../../domain/user';
import { IUserRepo } from '../../domain/ports/IUserRepo';
import { AppError } from '../../../../shared/core/AppError';
import { Either, Result, left, right } from './../../../../shared/core/Result';
import { UseCase } from './../../../../shared/core/UseCase';
import TYPES from '../../../../shared/infra/constants/types';

export type Response = Either<AppError.UnexpectedError, Result<User[]>>;

@injectable()
export class GetAllUsers implements UseCase<GetAllUsers, Promise<Response>> {
  constructor(@inject(TYPES.IUserRepo) private userRepo: IUserRepo) {}

  public async execute(): Promise<Response> {
    let users: User[];
    try {
      users = await this.userRepo.getAllUsers();
      return right(Result.ok<User[]>(users));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
