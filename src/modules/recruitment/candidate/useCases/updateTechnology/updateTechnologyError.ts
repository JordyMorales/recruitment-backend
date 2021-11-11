import { UseCaseError } from '../../../../../shared/core/UseCaseError';
import { Result } from '../../../../../shared/core/Result';

export namespace UpdateTechnologyErrors {
  export class TechnologyNotFoundError extends Result<UseCaseError> {
    constructor(id: string) {
      super(false, {
        message: `Couldn't find a technology by id {${id}}.`,
      } as UseCaseError);
    }
  }
}
