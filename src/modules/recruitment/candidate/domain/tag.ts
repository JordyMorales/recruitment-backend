import { TagId } from './tagId';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';

export interface TagProps {
  name: string;
  color: string;
  isActive?: boolean;
}

export class Tag extends AggregateRoot<TagProps> {
  get tagId(): TagId {
    return TagId.create(this._id).getValue();
  }

  get name(): string {
    return this.props.name;
  }

  get color(): string {
    return this.props.color;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  private constructor(props: TagProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: TagProps, id?: UniqueEntityID): Result<Tag> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.name, argumentName: 'name' },
      { argument: props.color, argumentName: 'color' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<Tag>(nullGuard.message);
    } else {
      const values = {
        ...props,
        isActive: props.isActive ? props.isActive : true,
      };

      const tag = new Tag(values, id);
      return Result.ok<Tag>(tag);
    }
  }
}
