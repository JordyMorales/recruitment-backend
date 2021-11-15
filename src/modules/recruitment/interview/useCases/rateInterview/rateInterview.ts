import { injectable, inject } from 'inversify';
import { Rate, RateProps } from '../../domain/rate';
import { RateInterviewErrors } from './rateInterviewErrors';
import { IInterviewRepo } from '../../domain/ports/IInterviewRepo';
import { IRateRepo } from '../../domain/ports/IRateRepo';
import { InterviewId } from '../../domain/interviewId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { RateInterviewRequestDTO } from './rateInterviewRequestDTO';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { IInterviewerRepo } from '../../domain/ports/IInterviewerRepo';
import TYPES from '../../../../../shared/infra/constants/types';
import { UserId } from '../../../../users/domain/userId';

type Response = Either<RateInterviewErrors.InterviewNotFoundError | AppError.UnexpectedError, Result<Rate>>;

@injectable()
export class RateInterview implements UseCase<RateInterviewRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IRateRepo) private rateRepo: IRateRepo,
    @inject(TYPES.IInterviewRepo) private interviewRepo: IInterviewRepo,
    @inject(TYPES.IInterviewerRepo) private interviewerRepo: IInterviewerRepo,
  ) {}

  public async execute(request?: RateInterviewRequestDTO): Promise<Response> {
    try {
      const interviewId = InterviewId.create(new UniqueEntityID(request.interviewId)).getValue();
      const interviewExists = await this.interviewRepo.exists(interviewId);

      if (!interviewExists) {
        return left(new RateInterviewErrors.InterviewNotFoundError(request.interviewId)) as Response;
      }

      const userId = UserId.create(new UniqueEntityID(request.ratedBy.userId)).getValue();
      const ratedBy = await this.interviewerRepo.getInterviewer(userId, interviewId);

      const rateProps: RateProps = {
        ...request,
        interviewId,
        ratedBy: ratedBy.interviewerId,
      };

      const rateOrError = Rate.create(rateProps);

      if (rateOrError.isFailure) {
        return left(Result.fail(rateOrError.error.toString()));
      }

      const rate: Rate = rateOrError.getValue();

      await this.rateRepo.save(rate);

      return right(Result.ok<Rate>(rate));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
