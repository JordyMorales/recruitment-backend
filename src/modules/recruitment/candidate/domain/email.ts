import { EmailId } from './emailId';
import { CandidateId } from './candidateId';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { TextUtils } from '../../../../shared/utils/TextUtils';

export interface EmailProps {
  value: string;
  candidateId?: CandidateId;
}

export class Email extends AggregateRoot<EmailProps> {
  get emailId(): EmailId {
    return EmailId.create(this._id).getValue();
  }

  get value(): string {
    return this.props.value;
  }

  get candidateId(): CandidateId {
    return this.props.candidateId;
  }

  private static format(email: string): string {
    return email.trim().toLowerCase();
  }

  private constructor(props: EmailProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: EmailProps, id?: UniqueEntityID): Result<Email> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([{ argument: props.value, argumentName: 'value' }]);

    if (!nullGuard.succeeded) {
      return Result.fail<Email>(nullGuard.message);
    }

    if (!TextUtils.validateEmailAddress(props.value)) {
      return Result.fail<Email>(`The email '${props.value}' is not valid`);
    }
    const values = {
      ...props,
      candidateId: props.candidateId ? props.candidateId : null,
    };
    const email = new Email({ ...values, value: this.format(props.value) }, id);
    return Result.ok<Email>(email);
  }
}
