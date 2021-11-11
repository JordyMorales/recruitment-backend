import { injectable, inject } from 'inversify';
import { Candidate } from './../../domain/candidate';
import { ICandidateRepo } from '../../domain/ports/ICandidateRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<AppError.UnexpectedError, Result<Candidate[]>>;

@injectable()
export class GetAllCandidates implements UseCase<GetAllCandidates, Promise<Response>> {
  constructor(@inject(TYPES.ICandidateRepo) private candidateRepo: ICandidateRepo) {}

  public async execute(): Promise<Response> {
    try {
      const candidates: Candidate[] = await this.candidateRepo.searchAll();
      return right(Result.ok<Candidate[]>(candidates));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
