import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace GetStepApplicationsErrors {
  export class StepNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No step with the id ${id} was found`,
      } as UseCaseError);
    }
  }

  export class JobNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No job with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
