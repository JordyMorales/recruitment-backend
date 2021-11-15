import { injectable, inject } from 'inversify';
import { Interviewer, InterviewerProps } from '../../domain/interviewer';
import { AssignInterviewerErrors } from './assignInterviewerErrors';
import { IInterviewerRepo } from '../../domain/ports/IInterviewerRepo';
import { AssignInterviewerRequestDTO } from './assignInterviewerRequestDTO';
import { IUserRepo } from '../../../../users/domain/ports/IUserRepo';
import { IInterviewRepo } from '../../domain/ports/IInterviewRepo';
import { UserId } from '../../../../users/domain/userId';
import { InterviewId } from '../../domain/interviewId';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  | AssignInterviewerErrors.InterviewerAlreadyAssignedError
  | AssignInterviewerErrors.UserNotFoundError
  | AssignInterviewerErrors.InterviewNotFoundError
  | AppError.UnexpectedError,
  Result<Interviewer>
>;

@injectable()
export class AssignInterviewer implements UseCase<AssignInterviewerRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IInterviewerRepo) private interviewerRepo: IInterviewerRepo,
    @inject(TYPES.IUserRepo) private userRepo: IUserRepo,
    @inject(TYPES.IInterviewRepo) private interviewRepo: IInterviewRepo,
  ) {}

  public async execute(request?: AssignInterviewerRequestDTO): Promise<Response> {
    try {
      const userId = UserId.create(new UniqueEntityID(request.userId)).getValue();
      const interviewId = InterviewId.create(new UniqueEntityID(request.interviewId)).getValue();

      const interviewerAlreadyAssigned = await this.interviewerRepo.exists(userId, interviewId);

      if (interviewerAlreadyAssigned) {
        return left(new AssignInterviewerErrors.InterviewerAlreadyAssignedError()) as Response;
      }

      const userFound = await this.userRepo.getUserById(userId);
      const userExists = !!userFound === true;

      if (!userExists) {
        return left(new AssignInterviewerErrors.UserNotFoundError(request.userId)) as Response;
      }

      const interviewExists = await this.interviewRepo.exists(interviewId);

      if (!interviewExists) {
        return left(new AssignInterviewerErrors.InterviewNotFoundError(request.interviewId)) as Response;
      }

      const interviewProps: InterviewerProps = { userId, interviewId };

      const interviewOrError = Interviewer.create(interviewProps);

      if (interviewOrError.isFailure) {
        return left(Result.fail(interviewOrError.error.toString()));
      }
      const interviewer: Interviewer = interviewOrError.getValue();

      await this.interviewerRepo.save(interviewer);

      return right(Result.ok<Interviewer>(interviewer));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
