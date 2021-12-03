import { Job } from '../job';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { IDomainEvent } from '../../../../../shared/domain/events/IDomainEvent';

export class JobCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public job: Job;

  constructor(job: Job) {
    this.dateTimeOccurred = new Date();
    this.job = job;
  }

  getAggregateId(): UniqueEntityID {
    return this.job.id;
  }
}
