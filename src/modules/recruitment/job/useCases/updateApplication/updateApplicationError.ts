import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace UpdateApplicationErrors {
  export class ApplicationNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `Couldn't find a job by id {${id}}.`,
      } as UseCaseError);
    }
  }

  export class StepDoesNotExists extends Result<UseCaseError> {
    constructor(step: string) {
      super(false, {
        message: `Step ${step} does not exists`,
      } as UseCaseError);
    }
  }

  export class ForbiddenError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `You do not have the necessary permission to edit this application.`,
      } as UseCaseError);
    }
  }
}
