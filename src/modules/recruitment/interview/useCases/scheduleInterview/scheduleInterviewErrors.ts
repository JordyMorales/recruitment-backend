import { Result } from '../../../../../shared/core/Result';
import { UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace ScheduleInterviewErrors {
  export class ApplicationNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No application with the id ${id} was found`,
      } as UseCaseError);
    }
  }

  export class StepNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No step with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
