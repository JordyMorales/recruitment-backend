import { injectable, inject } from 'inversify';
import { User } from '../../domain/user';
import { UserId } from '../../domain/userId';
import { IUserRepo } from '../../domain/ports/IUserRepo';
import { UseCase } from '../../../../shared/core/UseCase';
import { AppError } from '../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { GetUserByIdRequestDTO } from './getUserByIdRequestDTO';
import { GetUserByIdErrors } from './getUserByIdErrors';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../shared/infra/constants/types';

export type Response = Either<GetUserByIdErrors.UserNotFoundError | AppError.UnexpectedError, Result<User>>;

@injectable()
export class GetUserById implements UseCase<GetUserByIdRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.IUserRepo) private userRepo: IUserRepo) {}

  public async execute(request: GetUserByIdRequestDTO): Promise<Response> {
    try {
      const userId = UserId.create(new UniqueEntityID(request.userId)).getValue();
      const userFound = await this.userRepo.getUserById(userId);
      const exists = !!userFound === true;

      if (!exists) {
        return left(new GetUserByIdErrors.UserNotFoundError(request.userId)) as Response;
      }

      return right(Result.ok<User>(userFound));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
