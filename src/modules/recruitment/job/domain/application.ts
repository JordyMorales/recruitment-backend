import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { Candidate } from '../../candidate/domain/candidate';
import { ApplicationId } from './applicationId';
import { ApplicationState } from './applicationState';
import { JobId } from './jobId';
import { StepId } from './stepId';

export interface ApplicationProps {
  dateOfApplication?: Date;
  otherInfo?: string;
  appliedBy: Candidate;
  jobId: JobId;
  stepId: StepId;
  state?: ApplicationState;
}

export class Application extends AggregateRoot<ApplicationProps> {
  get applicationId(): ApplicationId {
    return ApplicationId.create(this._id).getValue();
  }

  get dateOfApplication(): Date {
    return this.props.dateOfApplication;
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

  get stepId(): StepId {
    return this.props.stepId;
  }

  get state(): ApplicationState {
    return this.props.state;
  }

  private constructor(props: ApplicationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ApplicationProps, id?: UniqueEntityID): Result<Application> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.appliedBy, argumentName: 'appliedBy' },
      { argument: props.jobId, argumentName: 'jobId' },
      { argument: props.stepId, argumentName: 'stepId' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Application>(nullGuard.message);
    } else {
      const values = {
        ...props,
        dateOfApplication: props.dateOfApplication ? props.dateOfApplication : new Date(),
        otherInfo: props.otherInfo ? props.otherInfo : null,
        state: props.state ? props.state : 'APPLIED',
      };

      const application = new Application(values, id);
      return Result.ok<Application>(application);
    }
  }
}
