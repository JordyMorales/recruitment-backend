import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { IDomainEvent } from '../../../../../shared/domain/events/IDomainEvent';
import { Application } from '../application';

export class ApplicationChanged implements IDomainEvent {
  public dateTimeOccurred: Date;
  public application: Application;

  constructor(application: Application) {
    this.dateTimeOccurred = new Date();
    this.application = application;
  }

  getAggregateId(): UniqueEntityID {
    return this.application.id;
  }
}
