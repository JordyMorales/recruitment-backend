import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace GetApplicationInterviewsErrors {
  export class ApplicationNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No application with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
