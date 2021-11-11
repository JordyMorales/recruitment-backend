import { TechnologyId } from './technologyId';
import { Guard } from '../../../../shared/core/Guard';
import { Result } from '../../../../shared/core/Result';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export interface TechnologyProps {
  name: string;
  isActive?: boolean;
}

export class Technology extends AggregateRoot<TechnologyProps> {
  get technologyId(): TechnologyId {
    return TechnologyId.create(this._id).getValue();
  }

  get name(): string {
    return this.props.name;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  private constructor(props: TechnologyProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: TechnologyProps, id?: UniqueEntityID): Result<Technology> {
    const nullGuard = Guard.againstNullOrUndefined(props.name, 'name');

    if (!nullGuard.succeeded) {
      return Result.fail<Technology>(nullGuard.message);
    } else {
      const values = {
        ...props,
        isActive: props.hasOwnProperty('isActive') ? props.isActive : true,
      };

      const technology = new Technology(values, id);
      return Result.ok<Technology>(technology);
    }
  }
}
