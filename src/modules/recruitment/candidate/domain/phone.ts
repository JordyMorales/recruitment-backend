import { PhoneId } from './phoneId';
import { CandidateId } from './candidateId';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export interface PhoneProps {
  value: string;
  candidateId?: CandidateId;
}

export class Phone extends AggregateRoot<PhoneProps> {
  get phoneId(): PhoneId {
    return PhoneId.create(this._id).getValue();
  }

  get value(): string {
    return this.props.value;
  }

  get candidateId(): CandidateId {
    return this.props.candidateId;
  }

  private constructor(props: PhoneProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: PhoneProps, id?: UniqueEntityID): Result<Phone> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.value, argumentName: 'value' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Phone>(nullGuard.message);
    } else {
      const values= {
        ...props,
        candidateId: props.candidateId ? props.candidateId : null,
      }
      const phone = new Phone(values, id);
      return Result.ok<Phone>(phone);
    }
  }
}
