import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace ApplyForJobErrors {
  export class ApplicationAlreadyExistsError extends Result<UseCaseError> {
    constructor() {
      super(false, {
        message: `This candidate has already applied to the job.`,
      } as UseCaseError);
    }
  }

  export class JobDoesNotExists extends Result<UseCaseError> {
    constructor(job: string) {
      super(false, {
        message: `Job ${job} does not exists`,
      } as UseCaseError);
    }
  }

  export class CandidateDoesNotExists extends Result<UseCaseError> {
    constructor(candidate: string) {
      super(false, {
        message: `Candidate ${candidate} does not exists`,
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
}
