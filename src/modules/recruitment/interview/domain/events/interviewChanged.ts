import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { IDomainEvent } from '../../../../../shared/domain/events/IDomainEvent';
import { Interview } from '../interview';

export class InterviewChanged implements IDomainEvent {
  public dateTimeOccurred: Date;
  public interview: Interview;

  constructor(interview: Interview) {
    this.dateTimeOccurred = new Date();
    this.interview = interview;
  }

  getAggregateId(): UniqueEntityID {
    return this.interview.id;
  }
}
