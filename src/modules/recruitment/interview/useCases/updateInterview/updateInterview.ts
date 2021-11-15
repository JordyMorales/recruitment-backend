import { injectable, inject } from 'inversify';
import { Interview, InterviewProps } from '../../domain/interview';
import { IInterviewRepo } from '../../domain/ports/IInterviewRepo';
import { UpdateInterviewErrors } from './updateInterviewError';
import { UpdateInterviewRequestDTO } from './updateInterviewRequestDTO';
import { InterviewId } from '../../domain/interviewId';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  UpdateInterviewErrors.InterviewNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class UpdateInterview implements UseCase<UpdateInterviewRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.IInterviewRepo) private interviewRepo: IInterviewRepo) {}

  public async execute(request: UpdateInterviewRequestDTO): Promise<Response> {
    try {
      const interviewId = InterviewId.create(new UniqueEntityID(request.interviewId)).getValue();
      const interviewFound = await this.interviewRepo.getInterviewById(interviewId);
      const interviewExists = !!interviewFound === true;

      if (!interviewExists) {
        return left(new UpdateInterviewErrors.InterviewNotFoundError(request.interviewId)) as Response;
      }

      const interviewProps: InterviewProps = {
        ...interviewFound.props,
        ...request,
        applicationId: interviewFound.applicationId,
        stepId: interviewFound.stepId,
      };

      const interviewOrError = Interview.create(interviewProps, interviewFound.id);

      if (interviewOrError.isFailure) {
        return left(Result.fail(interviewOrError.error.toString()));
      }
      const interview: Interview = interviewOrError.getValue();

      await this.interviewRepo.update(interview);

      return right(Result.ok<void>());
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
