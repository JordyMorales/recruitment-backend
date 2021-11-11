import { injectable, inject } from 'inversify';
import { Technology } from '../../domain/technology';
import { ITechnologyRepo } from '../../domain/ports/ITechnologyRepo';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<AppError.UnexpectedError, Result<Technology[]>>;

@injectable()
export class GetAllTechnologies implements UseCase<GetAllTechnologies, Promise<Response>> {
  constructor(@inject(TYPES.ITechnologyRepo) private technologyRepo: ITechnologyRepo) {}

  public async execute(): Promise<Response> {
    let technologies: Technology[];
    try {
      technologies = await this.technologyRepo.getAllTechnologies();
      return right(Result.ok<Technology[]>(technologies));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
