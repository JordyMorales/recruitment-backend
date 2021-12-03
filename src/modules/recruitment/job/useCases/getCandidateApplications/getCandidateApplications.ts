import { injectable, inject } from 'inversify';
import { Application } from '../../domain/application';
import { CandidateId } from '../../../candidate/domain/candidateId';
import { ICandidateRepo } from '../../../candidate/domain/ports/ICandidateRepo';
import { IApplicationRepo } from '../../domain/ports/IApplicationRepo';
import { GetCandidateApplicationsErrors } from './getCandidateApplicationsErrors';
import { GetCandidateApplicationsRequestDTO } from './getCandidateApplicationsRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  GetCandidateApplicationsErrors.CandidateNotFoundError | AppError.UnexpectedError,
  Result<Application[]>
>;

@injectable()
export class GetCandidateApplications
  implements UseCase<GetCandidateApplicationsRequestDTO, Promise<Response>>
{
  constructor(
    @inject(TYPES.ICandidateRepo) private candidateRepo: ICandidateRepo,
    @inject(TYPES.IApplicationRepo) private applicationRepo: IApplicationRepo,
  ) {}

  public async execute(request: GetCandidateApplicationsRequestDTO): Promise<Response> {
    try {
      const candidateId = CandidateId.create(new UniqueEntityID(request.candidateId)).getValue();
      const candidateFound = await this.candidateRepo.getCandidateById(candidateId);
      const exists = !!candidateFound === true;

      if (!exists) {
        return left(
          new GetCandidateApplicationsErrors.CandidateNotFoundError(request.candidateId),
        ) as Response;
      }

      const applications = await this.applicationRepo.getCandidateApplications(candidateId);

      return right(Result.ok<Application[]>(applications));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
