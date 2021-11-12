import { injectable, inject } from 'inversify';
import { Job } from '../../domain/job';
import { JobId } from '../../domain/jobId';
import { IJobRepo } from '../../domain/ports/IJobRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { GetJobByIdErrors } from './getJobByIdErrors';
import { GetJobByIdRequestDTO } from './getJobByIdRequestDTO';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<GetJobByIdErrors.JobNotFoundError | AppError.UnexpectedError, Result<Job>>;

@injectable()
export class GetJobById implements UseCase<GetJobByIdRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.IJobRepo) private jobRepo: IJobRepo) {}

  public async execute(request: GetJobByIdRequestDTO): Promise<Response> {
    try {
      const jobId = JobId.create(new UniqueEntityID(request.jobId)).getValue();
      const jobFound = await this.jobRepo.getJobById(jobId);
      const exists = !!jobFound === true;

      if (!exists) {
        return left(new GetJobByIdErrors.JobNotFoundError(request.jobId)) as Response;
      }

      return right(Result.ok<Job>(jobFound));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
