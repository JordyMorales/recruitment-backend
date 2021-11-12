import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace AddStepToProcessErrors {
  export class ProcessDoesNotExists extends Result<UseCaseError> {
    constructor(processId: string) {
      super(false, {
        message: `Process ${processId} does not exists`,
      } as UseCaseError);
    }
  }
}
