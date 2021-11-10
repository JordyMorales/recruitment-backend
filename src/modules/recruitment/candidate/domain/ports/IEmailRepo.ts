import { Email } from '../email';
import { CandidateId } from '../candidateId';

export interface IEmailRepo {
  exists(email: string): Promise<boolean>;
  getCandidateEmails(candidateId: CandidateId): Promise<Email[]>;
  save(email: Email): Promise<void>;
  update(email: Email): Promise<void>;
  delete(email: Email): Promise<void>;
}
