import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace CreateTagErrors {
  export class TagAlreadyExistsError extends Result<UseCaseError> {
    constructor(tag: string) {
      super(false, {
        message: `Tag ${tag} already exists.`,
      } as UseCaseError);
    }
  }
}
