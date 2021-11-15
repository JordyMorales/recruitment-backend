import { injectable, inject } from 'inversify';
import { Rate } from '../../domain/rate';
import { IRateRepo } from '../../domain/ports/IRateRepo';
import { InterviewId } from '../../domain/interviewId';
import { IApplicationRepo } from '../../../job/domain/ports/IApplicationRepo';
import { GetInterviewRatingsErrors } from './getInterviewRatingsErrors';
import { GetInterviewRatingsRequestDTO } from './getInterviewRatingsRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';
import { IInterviewRepo } from '../../domain/ports/IInterviewRepo';

export type Response = Either<
  GetInterviewRatingsErrors.InterviewNotFoundError | AppError.UnexpectedError,
  Result<Rate[]>
>;

@injectable()
export class GetInterviewRatings implements UseCase<GetInterviewRatingsRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IRateRepo) private rateRepo: IRateRepo,
    @inject(TYPES.IInterviewRepo) private applicationRepo: IInterviewRepo,
  ) {}

  public async execute(request: GetInterviewRatingsRequestDTO): Promise<Response> {
    try {
      const interviewId = InterviewId.create(new UniqueEntityID(request.interviewId)).getValue();
      const interviewFound = await this.applicationRepo.getInterviewById(interviewId);
      const exists = !!interviewFound === true;

      if (!exists) {
        return left(new GetInterviewRatingsErrors.InterviewNotFoundError(request.interviewId)) as Response;
      }

      const rates = await this.rateRepo.getAllInterviewRates(interviewId);

      return right(Result.ok<Rate[]>(rates));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
