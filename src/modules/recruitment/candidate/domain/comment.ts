import { CommentId } from './commentId';
import { CandidateId } from './candidateId';
import { User } from '../../../users/domain/user';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export interface CommentProps {
  comment: string;
  candidateId: CandidateId;
  parentCommentId?: CommentId;
  commentedBy: User;
  commentedAt?: Date;
}

export class Comment extends AggregateRoot<CommentProps> {
  get commentId(): CommentId {
    return CommentId.create(this._id).getValue();
  }

  get comment(): string {
    return this.props.comment;
  }

  get candidateId(): CandidateId {
    return this.props.candidateId;
  }

  get parentCommentId(): CommentId {
    return this.props.parentCommentId;
  }

  get commentedBy(): User {
    return this.props.commentedBy;
  }

  get commentedAt(): Date {
    return this.props.commentedAt;
  }

  private constructor(props: CommentProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: CommentProps, id?: UniqueEntityID): Result<Comment> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.comment, argumentName: 'comment' },
      { argument: props.candidateId, argumentName: 'candidateId' },
      { argument: props.commentedBy, argumentName: 'commentedBy' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Comment>(nullGuard.message);
    } else {
      const values = {
        ...props,
        parentCommentId: props.parentCommentId ? props.parentCommentId : null,
        commentedAt: props.commentedAt ? props.commentedAt : new Date(),
      };
      const comment = new Comment(values, id);
      return Result.ok<Comment>(comment);
    }
  }
}
