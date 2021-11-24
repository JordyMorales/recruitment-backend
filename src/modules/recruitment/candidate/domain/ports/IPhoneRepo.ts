import { Phone } from '../phone';
import { CandidateId } from '../candidateId';

export interface IPhoneRepo {
  exists(phone: string): Promise<boolean>;
  getCandidatePhones(candidateId: CandidateId): Promise<Phone[]>;
  getPhone(phone: string): Promise<Phone>;
  save(phone: Phone): Promise<void>;
  update(phone: Phone): Promise<void>;
  delete(phone: Phone): Promise<void>;
}
