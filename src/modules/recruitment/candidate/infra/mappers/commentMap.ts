import { Comment } from '../../domain/comment';
import { CommentId } from '../../domain/commentId';
import { CommentDTO } from '../../domain/dtos/commentDTO';
import { UserMap } from '../../../../users/infra/mappers/userMap';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Mapper } from '../../../../../shared/infra/Mapper';

export class CommentMap implements Mapper<Comment> {
  public static toDTO(comment: Comment): CommentDTO {
    return {
      commentId: comment.id.toString(),
      comment: comment.comment,
      candidateId: comment.candidateId.id.toString(),
      parentCommentId: comment.parentCommentId ? comment.parentCommentId.id.toString() : null,
      commentedBy: UserMap.toDTO(comment.commentedBy),
      commentedAt: comment.commentedAt,
    };
  }

  public static toDomain(raw: any): Comment {
    const commentOrError = Comment.create(
      {
        comment: raw.comment,
        candidateId: raw.candidate_id,
        parentCommentId: raw.parent_comment_id ? CommentId.create(raw.parent_comment_id).getValue() : null,
        commentedBy: UserMap.toDomain(raw.commented_by),
        commentedAt: raw.commented_at,
      },
      new UniqueEntityID(raw.comment_id),
    );

    commentOrError.isFailure ? console.log(commentOrError.error) : '';

    return commentOrError.isSuccess ? commentOrError.getValue() : null;
  }

  public static toPersistence(comment: Comment): any {
    return {
      comment_id: comment.id.toString(),
      comment: comment.comment,
      candidate_id: comment.candidateId.id.toString(),
      parent_comment_id: comment.parentCommentId ? comment.parentCommentId.id.toString() : null,
      commented_by: comment.commentedBy.id.toString(),
      commented_at: comment.commentedAt,
    };
  }
}
