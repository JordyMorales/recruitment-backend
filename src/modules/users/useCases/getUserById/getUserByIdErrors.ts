import { UseCaseError } from '../../../../shared/core/UseCaseError';
import { Result } from './../../../../shared/core/Result';

export namespace GetUserByIdErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No user with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
