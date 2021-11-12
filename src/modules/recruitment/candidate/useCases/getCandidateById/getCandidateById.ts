import { injectable, inject } from 'inversify';
import { Candidate } from '../../domain/candidate';
import { CandidateId } from '../../domain/candidateId';
import { ICandidateRepo } from '../../domain/ports/ICandidateRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { GetCandidateByIdErrors } from './getCandidateByIdErrors';
import { GetCandidateByIdRequestDTO } from './getCandidateByIdRequestDTO';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  GetCandidateByIdErrors.CandidateNotFoundError | AppError.UnexpectedError,
  Result<Candidate>
>;

@injectable()
export class GetCandidateById implements UseCase<GetCandidateByIdRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.ICandidateRepo) private candidateRepo: ICandidateRepo) {}

  public async execute(request: GetCandidateByIdRequestDTO): Promise<Response> {
    try {
      const candidateId = CandidateId.create(new UniqueEntityID(request.candidateId)).getValue();
      const candidateFound = await this.candidateRepo.getCandidateById(candidateId);
      const exists = !!candidateFound === true;

      if (!exists) {
        return left(new GetCandidateByIdErrors.CandidateNotFoundError(request.candidateId)) as Response;
      }

      return right(Result.ok<Candidate>(candidateFound));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
