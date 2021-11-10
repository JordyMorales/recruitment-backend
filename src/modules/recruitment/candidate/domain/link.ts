import { LinkId } from './linkId';
import { CandidateId } from './candidateId';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { TextUtils } from '../../../../shared/utils/TextUtils';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export interface LinkProps {
  value: string;
  candidateId?: CandidateId;
}

export class Link extends AggregateRoot<LinkProps> {
  get linkId(): LinkId {
    return LinkId.create(this._id).getValue();
  }

  get value(): string {
    return this.props.value;
  }

  get candidateId(): CandidateId {
    return this.props.candidateId;
  }

  private constructor(props: LinkProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: LinkProps, id?: UniqueEntityID): Result<Link> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.value, argumentName: 'value' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Link>(nullGuard.message);
    }

    if (!TextUtils.validateWebURL(props.value)) {
      return Result.fail<Link>(`Url {${props.value}} is not valid.`);
    }
    const values= {
      ...props,
      candidateId: props.candidateId ? props.candidateId : null,
    }
    const link = new Link(values, id);
    return Result.ok<Link>(link);
  }
}
