import { Result } from '../../../../../shared/core/Result';
import { UseCaseError } from '../../../../../shared/core/UseCaseError';

export namespace AssignInterviewerErrors {
  export class InterviewerAlreadyAssignedError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `The interviewer is already assigned to the interview.`,
      } as UseCaseError);
    }
  }

  export class UserNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No user with the id ${id} was found`,
      } as UseCaseError);
    }
  }

  export class InterviewNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No interview with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
