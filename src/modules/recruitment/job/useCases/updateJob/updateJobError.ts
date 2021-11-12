import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace UpdateJobErrors {
  export class JobNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `Couldn't find a job by id {${id}}.`,
      } as UseCaseError);
    }
  }

  export class ProcessNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `Couldn't find a process by id {${id}}.`,
      } as UseCaseError);
    }
  }
}
