import { StepId } from './stepId';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { ProcessId } from './processId';

export interface StepProps {
  order: number;
  name: string;
  description?: string;
  processId: ProcessId;
}

export class Step extends AggregateRoot<StepProps> {
  get stepId(): StepId {
    return StepId.create(this._id).getValue();
  }

  get order(): number {
    return this.props.order;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get processId(): ProcessId {
    return this.props.processId;
  }

  private constructor(props: StepProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: StepProps, id?: UniqueEntityID): Result<Step> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.order, argumentName: 'code' },
      { argument: props.name, argumentName: 'name' },
      { argument: props.processId, argumentName: 'processId' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Step>(nullGuard.message);
    } else {
      const values = {
        ...props,
        description: props.description ? props.description : null,
      };

      const step = new Step(values, id);
      return Result.ok<Step>(step);
    }
  }
}
