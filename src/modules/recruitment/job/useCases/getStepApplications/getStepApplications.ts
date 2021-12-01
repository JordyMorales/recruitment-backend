import { injectable, inject } from 'inversify';
import { Application } from '../../domain/application';
import { StepId } from '../../domain/stepId';
import { IStepRepo } from '../../domain/ports/IStepRepo';
import { IApplicationRepo } from '../../domain/ports/IApplicationRepo';
import { GetStepApplicationsErrors } from './getStepApplicationsErrors';
import { GetStepApplicationsRequestDTO } from './getStepApplicationsRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';
import { JobId } from '../../domain/jobId';
import { IJobRepo } from '../../domain/ports/IJobRepo';

export type Response = Either<
  GetStepApplicationsErrors.StepNotFoundError | AppError.UnexpectedError,
  Result<Application[]>
>;

@injectable()
export class GetStepApplications implements UseCase<GetStepApplicationsRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IApplicationRepo) private applicationRepo: IApplicationRepo,
    @inject(TYPES.IStepRepo) private stepRepo: IStepRepo,
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepo,
  ) {}

  public async execute(request: GetStepApplicationsRequestDTO): Promise<Response> {
    try {
      const stepId = StepId.create(new UniqueEntityID(request.stepId)).getValue();
      const stepFound = await this.stepRepo.getStepById(stepId);
      let exists = !!stepFound === true;

      if (!exists) {
        return left(new GetStepApplicationsErrors.StepNotFoundError(request.stepId)) as Response;
      }

      const jobId = JobId.create(new UniqueEntityID(request.jobId)).getValue();
      const jobFound = await this.jobRepo.getJobById(jobId);
      exists = !!jobFound === true;

      if (!exists) {
        return left(new GetStepApplicationsErrors.JobNotFoundError(request.stepId)) as Response;
      }

      const applications = await this.applicationRepo.getStepApplications(stepId, jobId);

      return right(Result.ok<Application[]>(applications));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
