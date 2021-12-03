import { Candidate } from '../candidate';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { IDomainEvent } from '../../../../../shared/domain/events/IDomainEvent';

export class CandidateCreated implements IDomainEvent {
  public dateTimeOccurred: Date;
  public candidate: Candidate;

  constructor(candidate: Candidate) {
    this.dateTimeOccurred = new Date();
    this.candidate = candidate;
  }

  getAggregateId(): UniqueEntityID {
    return this.candidate.id;
  }
}
