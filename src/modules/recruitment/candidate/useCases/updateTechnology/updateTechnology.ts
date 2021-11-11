import { injectable, inject } from 'inversify';
import { TechnologyId } from '../../domain/technologyId';
import { Technology, TechnologyProps } from '../../domain/technology';
import { ITechnologyRepo } from '../../domain/ports/ITechnologyRepo';
import { UpdateTechnologyErrors } from './updateTechnologyError';
import { UpdateTechnologyRequestDTO } from './updateTechnologyRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  UpdateTechnologyErrors.TechnologyNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class UpdateTechnology implements UseCase<UpdateTechnologyRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.ITechnologyRepo) private technologyRepo: ITechnologyRepo) {}

  public async execute(request: UpdateTechnologyRequestDTO): Promise<Response> {
    try {
      let technologyFound: Technology;

      try {
        const technologyId = TechnologyId.create(new UniqueEntityID(request.technologyId)).getValue();
        technologyFound = await this.technologyRepo.getTechnologyById(technologyId);
      } catch (error) {
        return left(new UpdateTechnologyErrors.TechnologyNotFoundError(request.technologyId));
      }

      const technologyProps: TechnologyProps = {
        ...technologyFound.props,
        ...request,
      };

      const technologyOrError = Technology.create(technologyProps, technologyFound.id);

      if (technologyOrError.isFailure) {
        return left(Result.fail<any>(technologyOrError.error.toString())) as Response;
      }

      const technology: Technology = technologyOrError.getValue();

      await this.technologyRepo.update(technology);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
