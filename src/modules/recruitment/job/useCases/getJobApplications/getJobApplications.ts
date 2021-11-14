import { injectable, inject } from 'inversify';
import { Application } from '../../domain/application';
import { JobId } from '../../domain/jobId';
import { IJobRepo } from '../../domain/ports/IJobRepo';
import { IApplicationRepo } from '../../domain/ports/IApplicationRepo';
import { GetJobApplicationsErrors } from './getJobApplicationsErrors';
import { GetJobApplicationsRequestDTO } from './getJobApplicationsRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  GetJobApplicationsErrors.JobNotFoundError | AppError.UnexpectedError,
  Result<Application[]>
>;

@injectable()
export class GetJobApplications implements UseCase<GetJobApplicationsRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepo,
    @inject(TYPES.IApplicationRepo) private applicationRepo: IApplicationRepo
  ) {}

  public async execute(request: GetJobApplicationsRequestDTO): Promise<Response> {
    try {
      const jobId = JobId.create(new UniqueEntityID(request.jobId)).getValue();
      const jobFound = await this.jobRepo.getJobById(jobId);
      const exists = !!jobFound === true;

      if (!exists) {
        return left(new GetJobApplicationsErrors.JobNotFoundError(request.jobId)) as Response;
      }

      const applications = await this.applicationRepo.getJobApplications(jobId);

      return right(Result.ok<Application[]>(applications));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
