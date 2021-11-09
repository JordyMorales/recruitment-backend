import { has } from 'lodash';
import { injectable, inject } from 'inversify';
import { User, UserProps } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';
import { IUserRepo } from '../../domain/ports/IUserRepo';
import { IAuthService } from '../../services/auth/IAuthService';
import { UseCase } from '../../../../shared/core/UseCase';
import { UpdateUserErrors } from './updateUserError';
import { UpdateUserRequestDTO } from './updateUserRequestDTO';
import { AppError } from '../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import { UserId } from '../../domain/userId';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../shared/infra/constants/types';

export type Response = Either<
  | UpdateUserErrors.UserNotFoundError
  | UpdateUserErrors.EmailAlreadyExistsError
  | AppError.UnexpectedError
  | Result<any>,
  Result<void>
>;

@injectable()
export class UpdateUser implements UseCase<UpdateUserRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IUserRepo) private userRepo: IUserRepo,
    @inject(TYPES.IAuthService) private authService: IAuthService,
  ) {}

  public async execute(request: UpdateUserRequestDTO): Promise<Response> {
    try {
      let userFound: User;
      let email: UserEmail;

      try {
        const userId = UserId.create(new UniqueEntityID(request.userId)).getValue();
        userFound = await this.userRepo.getUserById(userId);
      } catch (error) {
        return left(new UpdateUserErrors.UserNotFoundError(request.userId));
      }

      if (has(request, 'email')) {
        const emailOrError = UserEmail.create(request.email);
        if (emailOrError.isFailure) {
          return left(Result.fail<any>(emailOrError.error.toString())) as Response;
        }
        email = emailOrError.getValue();

        if (userFound.email.value !== request.email) {
          const UserAlreadyExists = await this.userRepo.exists(email);

          if (UserAlreadyExists) {
            return left(new UpdateUserErrors.EmailAlreadyExistsError(request.email)) as Response;
          }
        }
      }

      const userProps: UserProps = {
        ...userFound.props,
        ...request,
        email: email || userFound.email,
      };

      const userOrError = User.create(userProps, userFound.id);

      if (userOrError.isFailure) {
        return left(Result.fail<any>(userOrError.error.toString())) as Response;
      }

      const user: User = userOrError.getValue();

      await this.userRepo.update(user);
      await this.authService.updateUser(user);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
