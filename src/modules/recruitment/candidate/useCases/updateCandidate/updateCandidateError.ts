import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace UpdateCandidateErrors {
  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No user with the id ${id} was found`,
      } as UseCaseError);
    }
  }

  export class CandidateNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No candidate with the id ${id} was found`,
      } as UseCaseError);
    }
  }

  export class EmailAlreadyExistsError extends Result<UseCaseError> {
    constructor(email: string) {
      super(false, {
        message: `The email '${email}' already exists`,
      } as UseCaseError);
    }
  }

  export class PhoneAlreadyExistsError extends Result<UseCaseError> {
    constructor(phone: string) {
      super(false, {
        message: `The phone '${phone}' already exists`,
      } as UseCaseError);
    }
  }
}
