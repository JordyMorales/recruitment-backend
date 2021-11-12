import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace GetCandidateCommentsErrors {
  export class CandidateNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No candidate with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
