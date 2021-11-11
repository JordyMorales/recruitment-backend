import { injectable, inject } from 'inversify';
import { User, UserProps } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';
import { IUserRepo } from '../../domain/ports/IUserRepo';
import { IAuthService } from '../../services/auth/IAuthService';
import { UseCase } from '../../../../shared/core/UseCase';
import { CreateUserErrors } from './createUserErrors';
import { CreateUserRequestDTO } from './createUserRequestDTO';
import { UserPassword } from '../../domain/userPassword';
import { AppError } from '../../../../shared/core/AppError';
import { TextUtils } from './../../../../shared/utils/TextUtils';
import { Either, Result, left, right } from '../../../../shared/core/Result';
import TYPES from '../../../../shared/infra/constants/types';

type Response = Either<
  CreateUserErrors.EmailAlreadyExistsError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class CreateUser implements UseCase<CreateUserRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IUserRepo) private userRepo: IUserRepo,
    @inject(TYPES.IAuthService) private authService: IAuthService,
  ) {}

  public async execute(request: CreateUserRequestDTO): Promise<Response> {
    let password: UserPassword;
    let passwordOrError: Result<UserPassword>;
    let email: UserEmail;
    let emailOrError = UserEmail.create(request.email);
    try {
      request.hasOwnProperty('password')
        ? (passwordOrError = UserPassword.create(request.password))
        : (passwordOrError = UserPassword.create(TextUtils.generatePassword()));

      const dtoResult = Result.combine([emailOrError, passwordOrError]);

      if (dtoResult.isFailure) {
        return left(Result.fail<void>(dtoResult.error)) as Response;
      }

      password = passwordOrError.getValue();
      email = emailOrError.getValue();

      const UserAlreadyExists = await this.userRepo.exists(email);

      if (UserAlreadyExists) {
        return left(new CreateUserErrors.EmailAlreadyExistsError(request.email)) as Response;
      }

      const userProps: UserProps = {
        ...request,
        email,
        password,
      };

      const userOrError: Result<User> = User.create(userProps);

      if (userOrError.isFailure) {
        return left(Result.fail<User>(userOrError.error.toString())) as Response;
      }

      const user: User = userOrError.getValue();

      let userCreated = false;

      try {
        userCreated = await this.authService.createUser(user);
        await this.userRepo.save(user);
      } catch (error) {
        if (userCreated) await this.authService.deleteUser(user);
      }

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error)) as Response;
    }
  }
}
