import { injectable, inject } from 'inversify';
import { ApplicationId } from '../../../job/domain/applicationId';
import { Interview, InterviewProps } from '../../domain/interview';
import { ScheduleInterviewErrors } from './scheduleInterviewErrors';
import { ScheduleInterviewRequestDTO } from './scheduleInterviewRequestDTO';
import { IStepRepo } from '../../../job/domain/ports/IStepRepo';
import { IInterviewRepo } from '../../domain/ports/IInterviewRepo';
import { IApplicationRepo } from '../../../job/domain/ports/IApplicationRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<AppError.UnexpectedError, Result<Interview>>;

@injectable()
export class ScheduleInterview implements UseCase<ScheduleInterviewRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IInterviewRepo) private interviewRepo: IInterviewRepo,
    @inject(TYPES.IApplicationRepo) private applicationRepo: IApplicationRepo,
    @inject(TYPES.IStepRepo) private stepRepo: IStepRepo,
  ) {}

  public async execute(request?: ScheduleInterviewRequestDTO): Promise<Response> {
    try {
      const applicationId = ApplicationId.create(new UniqueEntityID(request.applicationId)).getValue();
      const applicationFound = await this.applicationRepo.getApplicationById(applicationId);
      const applicationExists = !!applicationFound === true;

      if (!applicationExists) {
        return left(new ScheduleInterviewErrors.ApplicationNotFoundError(request.applicationId)) as Response;
      }

      const stepId = ApplicationId.create(new UniqueEntityID(request.stepId)).getValue();
      const stepExists = await this.stepRepo.exists(stepId);

      if (!stepExists) {
        return left(new ScheduleInterviewErrors.StepNotFoundError(request.stepId)) as Response;
      }

      const interviewProps: InterviewProps = {
        ...request,
        applicationId,
        stepId
      };

      const interviewOrError = Interview.create(interviewProps);

      if (interviewOrError.isFailure) {
        return left(Result.fail(interviewOrError.error.toString()));
      }
      const interview: Interview = interviewOrError.getValue();

      await this.interviewRepo.save(interview);

      return right(Result.ok<Interview>(interview));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
