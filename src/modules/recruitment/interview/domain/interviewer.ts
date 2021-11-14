import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { UserId } from '../../../users/domain/userId';
import { InterviewerId } from './interviewerId';
import { InterviewId } from './interviewId';

export interface InterviewerProps {
  userId: UserId;
  interviewId: InterviewId;
}

export class Interviewer extends AggregateRoot<InterviewerProps> {
  get interviewerId(): InterviewerId {
    return InterviewerId.create(this._id).getValue();
  }

  get userId(): UserId {
    return this.props.userId;
  }

  get interviewId(): InterviewId {
    return this.props.interviewId;
  }

  private constructor(props: InterviewerProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: InterviewerProps, id?: UniqueEntityID): Result<Interviewer> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.userId, argumentName: 'userId' },
      { argument: props.interviewId, argumentName: 'interviewId' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Interviewer>(nullGuard.message);
    } else {
      const interview = new Interviewer(props, id);
      return Result.ok<Interviewer>(interview);
    }
  }
}
