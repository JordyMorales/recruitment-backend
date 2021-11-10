import { Candidate } from '../candidate';
import { CandidateId } from '../candidateId';

export interface ICandidateRepo {
  exists(candidateId: CandidateId): Promise<boolean>;
  getCandidateById(candidateId: CandidateId): Promise<Candidate>;
  searchAll(): Promise<Candidate[]>;
  save(candidate: Candidate): Promise<void>;
  update(candidate: Candidate): Promise<void>;
}
