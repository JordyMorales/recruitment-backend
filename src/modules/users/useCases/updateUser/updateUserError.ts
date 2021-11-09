import { UseCaseError } from '../../../../shared/core/UseCaseError';
import { Result } from './../../../../shared/core/Result';

export namespace UpdateUserErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `Couldn't find a user by id {${id}}.`,
      } as UseCaseError);
    }
  }

  export class EmailAlreadyExistsError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The email address ${email} is already in use by another account.`,
      } as UseCaseError);
    }
  }
}
