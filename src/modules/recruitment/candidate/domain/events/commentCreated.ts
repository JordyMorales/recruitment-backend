import { Comment } from '../comment';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { IDomainEvent } from '../../../../../shared/domain/events/IDomainEvent';

export class CommentCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public comment: Comment;

  constructor(comment: Comment) {
    this.dateTimeOccurred = new Date();
    this.comment = comment;
  }

  getAggregateId(): UniqueEntityID {
    return this.comment.id;
  }
}
