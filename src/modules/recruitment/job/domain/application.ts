import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { Candidate } from '../../candidate/domain/candidate';
import { ApplicationId } from './applicationId';
import { ApplicationState } from './applicationState';
import { JobId } from './jobId';
import { Step } from './step';

export interface ApplicationProps {
  otherInfo?: string;
  appliedBy: Candidate;
  jobId: JobId;
  step: Step;
  state?: ApplicationState;
  appliedAt?: Date;
  updatedAt?: Date;
}

export class Application extends AggregateRoot<ApplicationProps> {
  get applicationId(): ApplicationId {
    return ApplicationId.create(this._id).getValue();
  }

  get otherInfo(): string {
    return this.props.otherInfo;
  }

  get appliedBy(): Candidate {
    return this.props.appliedBy;
  }

  get jobId(): JobId {
    return this.props.jobId;
  }

  get step(): Step {
    return this.props.step;
  }

  get state(): ApplicationState {
    return this.props.state;
  }

  get appliedAt(): Date {
    return this.props.appliedAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  private constructor(props: ApplicationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ApplicationProps, id?: UniqueEntityID): Result<Application> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.appliedBy, argumentName: 'appliedBy' },
      { argument: props.jobId, argumentName: 'jobId' },
      { argument: props.step, argumentName: 'step' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Application>(nullGuard.message);
    } else {
      const values = {
        ...props,
        otherInfo: props.otherInfo ? props.otherInfo : null,
        state: props.state ? props.state : 'APPLIED',
        appliedAt: props.appliedAt ? props.appliedAt : new Date(),
        updatedAt: props.updatedAt ? props.updatedAt : new Date(),
      };

      const application = new Application(values, id);
      return Result.ok<Application>(application);
    }
  }
}
