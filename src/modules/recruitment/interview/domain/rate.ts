import { RateId } from './rateId';
import { InterviewId } from './interviewId';
import { InterviewerId } from './interviewerId';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { Result } from '../../../../shared/core/Result';
import { Guard } from '../../../../shared/core/Guard';

export interface RateProps {
  note: string;
  rate: number;
  pros: string;
  cons: string;
  ratedAt?: Date;
  ratedBy: InterviewerId;
  interviewId: InterviewId;
}

export class Rate extends AggregateRoot<RateProps> {
  get rateId(): RateId {
    return RateId.create(this._id).getValue();
  }

  get note(): string {
    return this.props.note;
  }

  get rate(): number {
    return this.props.rate;
  }

  get pros(): string {
    return this.props.pros;
  }

  get cons(): string {
    return this.props.cons;
  }

  get createdAt(): Date {
    return this.props.ratedAt;
  }

  get ratedBy(): InterviewerId {
    return this.props.ratedBy;
  }

  get interviewId(): InterviewId {
    return this.props.interviewId;
  }

  private constructor(props: RateProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: RateProps, id?: UniqueEntityID): Result<Rate> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.note, argumentName: 'note' },
      { argument: props.rate, argumentName: 'rate' },
      { argument: props.pros, argumentName: 'pros' },
      { argument: props.cons, argumentName: 'cons' },
      { argument: props.ratedBy, argumentName: 'ratedBy' },
      { argument: props.interviewId, argumentName: 'interviewId' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Rate>(nullGuard.message);
    } else {
      const values = {
        ...props,
        ratedAt: props.ratedAt ? props.ratedAt : new Date(),
      };

      const rate = new Rate(values, id);
      return Result.ok<Rate>(rate);
    }
  }
}
