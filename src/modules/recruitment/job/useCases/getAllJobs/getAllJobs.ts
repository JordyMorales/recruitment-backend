import { injectable, inject } from 'inversify';
import { Job } from '../../domain/job';
import { IJobRepo } from '../../domain/ports/IJobRepo';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<AppError.UnexpectedError, Result<Job[]>>;

@injectable()
export class GetAllJobs implements UseCase<GetAllJobs, Promise<Response>> {
  constructor(@inject(TYPES.IJobRepo) private jobRepo: IJobRepo) {}

  public async execute(): Promise<Response> {
    try {
      const jobs = await this.jobRepo.getAllJobs();
      return right(Result.ok<Job[]>(jobs));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
