import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace GetInterviewRatingsErrors {
  export class InterviewNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No interview with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
