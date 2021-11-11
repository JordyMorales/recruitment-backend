import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace CreateTechnologyErrors {
  export class TechnologyAlreadyExistsError extends Result<UseCaseError> {
    constructor(technology: string) {
      super(false, {
        message: `Technology ${technology} already exists.`,
      } as UseCaseError);
    }
  }
}
