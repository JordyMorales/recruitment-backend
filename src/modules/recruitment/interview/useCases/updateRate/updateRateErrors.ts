import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace UpdateRateErrors {
  export class RateNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `No rate with the id ${id} was found`,
      } as UseCaseError);
    }
  }
}
