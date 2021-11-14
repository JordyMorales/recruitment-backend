import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { ApplicationId } from '../../job/domain/applicationId';
import { InterviewId } from './interviewId';
import { StepId } from '../../job/domain/stepId';

export interface InterviewProps {
  topic: string;
  description?: string;
  applicationId: ApplicationId;
  scheduledAt: Date;
  duration: number;
  triggeredAt?: Date;
  stepId: StepId;
}

export class Interview extends AggregateRoot<InterviewProps> {
  get interviewId(): InterviewId {
    return InterviewId.create(this._id).getValue();
  }

  get topic(): string {
    return this.props.topic;
  }

  get description(): string {
    return this.props.description;
  }

  get applicationId(): ApplicationId {
    return this.props.applicationId;
  }

  get scheduledAt(): Date {
    return this.props.scheduledAt;
  }

  get duration(): number {
    return this.props.duration;
  }

  get triggeredAt(): Date {
    return this.props.triggeredAt;
  }

  get stepId(): StepId {
    return this.props.stepId;
  }

  private constructor(props: InterviewProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: InterviewProps, id?: UniqueEntityID): Result<Interview> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.topic, argumentName: 'topic' },
      { argument: props.applicationId, argumentName: 'applicationId' },
      { argument: props.scheduledAt, argumentName: 'scheduledAt' },
      { argument: props.duration, argumentName: 'duration' },
      { argument: props.stepId, argumentName: 'stepId' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Interview>(nullGuard.message);
    } else {
      const values = {
        ...props,
        description: props.description ? props.description : null,
        triggeredAt: props.scheduledAt
          ? props.scheduledAt
          : new Date(props.scheduledAt.getTime() - 30 * 60000),
      };

      const interview = new Interview(values, id);
      return Result.ok<Interview>(interview);
    }
  }
}
