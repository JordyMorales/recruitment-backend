import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { IDomainEvent } from '../../../../../shared/domain/events/IDomainEvent';
import { Job } from '../job';

export class JobChanged implements IDomainEvent {
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
