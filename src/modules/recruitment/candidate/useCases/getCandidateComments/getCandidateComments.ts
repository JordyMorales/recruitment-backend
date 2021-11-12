import { injectable, inject } from 'inversify';
import { Comment } from '../../domain/comment';
import { Candidate } from '../../domain/candidate';
import { CandidateId } from '../../domain/candidateId';
import { ICommentRepo } from '../../domain/ports/ICommentRepo';
import { ICandidateRepo } from '../../domain/ports/ICandidateRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { GetCandidateCommentsErrors } from './getCandidateCommentsErrors';
import { GetCandidateCommentsRequestDTO } from './getCandidateCommentsRequestDTO';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  GetCandidateCommentsErrors.CandidateNotFoundError | AppError.UnexpectedError,
  Result<Comment[]>
>;

@injectable()
export class GetCandidateComments implements UseCase<GetCandidateCommentsRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.ICommentRepo) private commentRepo: ICommentRepo,
    @inject(TYPES.ICandidateRepo) private candidateRepo: ICandidateRepo,
  ) {}

  public async execute(request: GetCandidateCommentsRequestDTO): Promise<Response> {
    try {
      const candidateId = CandidateId.create(new UniqueEntityID(request.candidateId)).getValue();
      const candidateFound = await this.candidateRepo.getCandidateById(candidateId);
      const userExists = !!candidateFound === true;

      if (!userExists) {
        return left(new GetCandidateCommentsErrors.CandidateNotFoundError(request.candidateId)) as Response;
      }

      const comments = await this.commentRepo.getCandidateComments(candidateId);

      return right(Result.ok<Comment[]>(comments));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
