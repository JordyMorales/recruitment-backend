import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { IDomainEvent } from '../../../../../shared/domain/events/IDomainEvent';
import { Rate } from '../rate';

export class RateCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public rate: Rate;

  constructor(rate: Rate) {
    this.dateTimeOccurred = new Date();
    this.rate = rate;
  }

  getAggregateId(): UniqueEntityID {
    return this.rate.id;
  }
}
