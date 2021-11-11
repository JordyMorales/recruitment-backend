import { injectable, inject } from 'inversify';
import { Technology } from '../../domain/technology';
import { CreateTechnologyErrors } from './createTechnologyErrors';
import { CreateTechnologyRequestDTO } from './createTechnologyRequestDTO';
import { ITechnologyRepo } from '../../domain/ports/ITechnologyRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  CreateTechnologyErrors.TechnologyAlreadyExistsError | AppError.UnexpectedError,
  Result<Technology>
>;

@injectable()
export class CreateTechnology implements UseCase<CreateTechnologyRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.ITechnologyRepo) private technologyRepo: ITechnologyRepo) {}

  public async execute(request?: CreateTechnologyRequestDTO): Promise<Response> {
    try {
      const technologyAlreadyExists = await this.technologyRepo.exists(request.name);
      if (technologyAlreadyExists) {
        return left(new CreateTechnologyErrors.TechnologyAlreadyExistsError(request.name)) as Response;
      }

      const technologyOrError = Technology.create(request);

      if (technologyOrError.isFailure) {
        return left(Result.fail(technologyOrError.error.toString()));
      }

      const technology = technologyOrError.getValue();

      await this.technologyRepo.save(technology);

      return right(Result.ok<Technology>(technology));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
