import { injectable, inject } from 'inversify';
import { ApplicationId } from '../../domain/applicationId';
import { ProcessId } from '../../domain/processId';
import { Application, ApplicationProps } from '../../domain/application';
import { IApplicationRepo } from '../../domain/ports/IApplicationRepo';
import { UpdateApplicationErrors } from './updateApplicationError';
import { UpdateApplicationRequestDTO } from './updateApplicationRequestDTO';
import { IStepRepo } from '../../domain/ports/IStepRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';
import { StepId } from '../../domain/stepId';
import { Step } from '../../domain/step';

export type Response = Either<
  UpdateApplicationErrors.ApplicationNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class UpdateApplication implements UseCase<UpdateApplicationRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IApplicationRepo) private applicationRepo: IApplicationRepo,
    @inject(TYPES.IStepRepo) private stepRepo: IStepRepo,
  ) {}

  public async execute(request: UpdateApplicationRequestDTO): Promise<Response> {
    try {
      const applicationId = ApplicationId.create(new UniqueEntityID(request.applicationId)).getValue();
      const applicationFound = await this.applicationRepo.getApplicationById(applicationId);
      const applicationExists = !!applicationFound === true;

      if (!applicationExists) {
        return left(new UpdateApplicationErrors.ApplicationNotFoundError(request.applicationId)) as Response;
      }

      if (request.updatedBy.role === 'CANDIDATE') {
        if (applicationFound.appliedBy.candidateId.id.toString() !== request.updatedBy.userId) {
          return left(new UpdateApplicationErrors.ForbiddenError()) as Response;
        }
      }

      let step: Step = null;

      if (request.hasOwnProperty('stepId')) {
        const stepId = StepId.create(new UniqueEntityID(request.stepId)).getValue();
        step = await this.stepRepo.getStepById(stepId);
        const stepExists = !!step === true;

        if (!stepExists) {
          return left(new UpdateApplicationErrors.StepDoesNotExists(request.stepId)) as Response;
        }
      }

      const applicationProps: ApplicationProps = {
        ...applicationFound.props,
        ...request,
        step,
        updatedAt: new Date(),
        appliedBy: applicationFound.appliedBy,
        jobId: applicationFound.jobId,
      };

      const applicationOrError = Application.create(applicationProps, applicationFound.id);

      if (applicationOrError.isFailure) {
        return left(Result.fail<any>(applicationOrError.error.toString())) as Response;
      }

      const application: Application = applicationOrError.getValue();

      await this.applicationRepo.update(application);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
