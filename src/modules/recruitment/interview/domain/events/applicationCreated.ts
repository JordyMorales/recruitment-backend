import { IDomainEvent } from '../../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Application } from '../../../job/domain/application';

export class ApplicationCreated implements IDomainEvent {
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
