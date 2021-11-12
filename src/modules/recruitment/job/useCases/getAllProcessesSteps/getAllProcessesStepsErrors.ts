import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace GetAllProcessesStepsErrors {
  export class ProcessNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No process with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
