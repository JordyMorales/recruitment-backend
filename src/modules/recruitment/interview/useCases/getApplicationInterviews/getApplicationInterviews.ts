import { injectable, inject } from 'inversify';
import { Interview } from '../../domain/interview';
import { ApplicationId } from '../../../job/domain/applicationId';
import { IInterviewRepo } from '../../domain/ports/IInterviewRepo';
import { IApplicationRepo } from '../../../job/domain/ports/IApplicationRepo';
import { GetApplicationInterviewsErrors } from './getApplicationInterviewsErrors';
import { GetApplicationInterviewsRequestDTO } from './getApplicationInterviewsRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  GetApplicationInterviewsErrors.ApplicationNotFoundError | AppError.UnexpectedError,
  Result<Interview[]>
>;

@injectable()
export class GetApplicationInterviews
  implements UseCase<GetApplicationInterviewsRequestDTO, Promise<Response>>
{
  constructor(
    @inject(TYPES.IInterviewRepo) private interviewRepo: IInterviewRepo,
    @inject(TYPES.IApplicationRepo) private applicationRepo: IApplicationRepo,
  ) {}

  public async execute(request: GetApplicationInterviewsRequestDTO): Promise<Response> {
    try {
      const applicationId = ApplicationId.create(new UniqueEntityID(request.applicationId)).getValue();
      const applicationFound = await this.applicationRepo.getApplicationById(applicationId);
      const exists = !!applicationFound === true;

      if (!exists) {
        return left(
          new GetApplicationInterviewsErrors.ApplicationNotFoundError(request.applicationId),
        ) as Response;
      }

      const interviews = await this.interviewRepo.getAllApplicationInterviews(applicationId);

      return right(Result.ok<Interview[]>(interviews));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
