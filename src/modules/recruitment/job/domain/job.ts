import { JobId } from './jobId';
import { JobState } from './jobState';
import { ProcessId } from './processId';
import { User } from '../../../users/domain/user';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';

export interface JobProps {
  name: string;
  description?: string;
  datePublished?: Date;
  startDate?: Date;
  vacancies?: number;
  processId: ProcessId;
  state?: JobState;
  createdBy: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Job extends AggregateRoot<JobProps> {
  get jobId(): JobId {
    return JobId.create(this._id).getValue();
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get datePublished(): Date {
    return this.props.datePublished;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get vacancies(): number {
    return this.props.vacancies;
  }

  get processId(): ProcessId {
    return this.props.processId;
  }

  get state(): JobState {
    return this.props.state;
  }

  get createdBy(): User {
    return this.props.createdBy;
  }

  get updatedBy(): User {
    return this.props.updatedBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.createdAt;
  }

  private constructor(props: JobProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: JobProps, id?: UniqueEntityID): Result<Job> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.processId, argumentName: 'processId' },
      { argument: props.createdBy, argumentName: 'createdBy' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Job>(nullGuard.message);
    } else {
      const values = {
        ...props,
        description: props.description ? props.description : null,
        datePublished: props.datePublished ? props.datePublished : null,
        startDate: props.startDate ? props.startDate : null,
        vacancies: props.vacancies ? props.vacancies : null,
        state: props.state ? props.state : 'DRAFF',
        updatedBy: props.updatedBy ? props.updatedBy : null,
        createdAt: props.createdAt ? props.createdAt : new Date(),
        updatedAt: props.updatedAt ? props.updatedAt : null,
      };

      const job = new Job(values, id);

      return Result.ok<Job>(job);
    }
  }
}
