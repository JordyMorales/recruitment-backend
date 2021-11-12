import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace CreateProcessErrors {
  export class ProcessAlreadyExistsError extends Result<UseCaseError> {
    constructor(process: string) {
      super(false, {
        message: `Process ${process} already exists.`,
      } as UseCaseError);
    }
  }
}
