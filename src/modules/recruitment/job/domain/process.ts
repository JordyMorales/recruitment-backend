import { ProcessId } from './processId';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export interface ProcessProps {
  code: string;
  name: string;
  description?: string;
}

export class Process extends AggregateRoot<ProcessProps> {
  get processId(): ProcessId {
    return ProcessId.create(this._id).getValue();
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  private constructor(props: ProcessProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: ProcessProps, id?: UniqueEntityID): Result<Process> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.code, argumentName: 'code' },
      { argument: props.name, argumentName: 'name' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Process>(nullGuard.message);
    } else {
      const values = {
        ...props,
        description: props.description ? props.description : null,
      };

      const process = new Process(values, id);
      return Result.ok<Process>(process);
    }
  }
}
