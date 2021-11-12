import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace CreateCommentErrors {
  export class CandidateNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `Couldn't find a candidate by id {${id}}.`,
      } as UseCaseError);
    }
  }
}
