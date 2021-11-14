import { inject, injectable } from 'inversify';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { CandidateId } from '../../../candidate/domain/candidateId';
import { ICandidateRepo } from '../../../candidate/domain/ports/ICandidateRepo';
import { Application, ApplicationProps } from '../../domain/application';
import { JobId } from '../../domain/jobId';
import { IApplicationRepo } from '../../domain/ports/IApplicationRepo';
import { IStepRepo } from '../../domain/ports/IStepRepo';
import { StepId } from '../../domain/stepId';
import { ApplyForJobErrors } from './applyForJobErrors';
import { ApplyForJobRequestDTO } from './applyForJobRequestDTO';
import TYPES from '../../../../../shared/infra/constants/types';

type Response = Either<
  | ApplyForJobErrors.ApplicationAlreadyExistsError
  | ApplyForJobErrors.JobDoesNotExists
  | AppError.UnexpectedError,
  Result<Application>
>;

@injectable()
export class ApplyForJob implements UseCase<ApplyForJobRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IApplicationRepo) private applicationRepo: IApplicationRepo,
    @inject(TYPES.ICandidateRepo) private candidateRepo: ICandidateRepo,
    @inject(TYPES.IStepRepo) private stepRepo: IStepRepo,
  ) {}

  public async execute(request?: ApplyForJobRequestDTO): Promise<Response> {
    try {
      const candidateId = CandidateId.create(new UniqueEntityID(request.appliedBy)).getValue();
      const appliedBy = await this.candidateRepo.getCandidateById(candidateId);
      if (!!appliedBy === false) {
        return left(new ApplyForJobErrors.CandidateDoesNotExists(request.appliedBy)) as Response;
      }

      const stepId = StepId.create(new UniqueEntityID(request.stepId)).getValue();
      const step = await this.stepRepo.getStepById(stepId);
      if (!!step === false) {
        return left(new ApplyForJobErrors.StepDoesNotExists(request.stepId)) as Response;
      }

      const jobId = JobId.create(new UniqueEntityID(request.jobId)).getValue();
      const jobAlreadyExists = await this.applicationRepo.exists(candidateId, jobId);
      if (jobAlreadyExists) {
        return left(new ApplyForJobErrors.ApplicationAlreadyExistsError()) as Response;
      }

      const applicationProps: ApplicationProps = { ...request, appliedBy, step, jobId };

      const applicationOrError = Application.create(applicationProps);

      if (applicationOrError.isFailure) {
        return left(Result.fail(applicationOrError.error.toString()));
      }
      const application: Application = applicationOrError.getValue();

      await this.applicationRepo.save(application);

      return right(Result.ok<Application>(application));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
