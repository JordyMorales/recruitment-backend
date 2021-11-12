import { injectable, inject } from 'inversify';
import { CommentId } from '../../domain/commentId';
import { Comment, CommentProps } from '../../domain/comment';
import { CreateCommentErrors } from './createCommentErrors';
import { CreateCommentRequestDTO } from './createCommentRequestDTO';
import { CandidateId } from '../../domain/candidateId';
import { ICommentRepo } from '../../domain/ports/ICommentRepo';
import { ICandidateRepo } from '../../domain/ports/ICandidateRepo';
import { UserMap } from '../../../../users/infra/mappers/userMap';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';

type Response = Either<
  CreateCommentErrors.CandidateNotFoundError | AppError.UnexpectedError,
  Result<Comment>
>;

@injectable()
export class CreateComment implements UseCase<CreateCommentRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.ICommentRepo) private commentRepo: ICommentRepo,
    @inject(TYPES.ICandidateRepo) private candidateRepo: ICandidateRepo,
  ) {}

  public async execute(request?: CreateCommentRequestDTO): Promise<Response> {
    try {
      const candidateId = CandidateId.create(new UniqueEntityID(request.candidateId)).getValue();
      const candidateFound = await this.candidateRepo.getCandidateById(candidateId);
      const userExists = !!candidateFound === true;

      if (!userExists) {
        return left(new CreateCommentErrors.CandidateNotFoundError(request.candidateId)) as Response;
      }

      const commentProps: CommentProps = {
        ...request,
        candidateId: CandidateId.create(new UniqueEntityID(request.candidateId)).getValue(),
        parentCommentId: request.parentCommentId
          ? CommentId.create(new UniqueEntityID(request.parentCommentId)).getValue()
          : null,
        commentedBy: UserMap.dtoToDomain(request.commentedBy),
      };
      const commentOrError = Comment.create(commentProps);

      if (commentOrError.isFailure) {
        return left(Result.fail(commentOrError.error.toString()));
      }

      const comment = commentOrError.getValue();

      await this.commentRepo.save(comment);

      return right(Result.ok<Comment>(comment));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
