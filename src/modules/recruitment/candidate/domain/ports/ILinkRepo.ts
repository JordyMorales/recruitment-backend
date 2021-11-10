import { Link } from '../link';
import { CandidateId } from '../candidateId';

export interface ILinkRepo {
  exists(link: string): Promise<boolean>;
  getCandidateLinks(candidateId: CandidateId): Promise<Link[]>;
  save(link: Link): Promise<void>;
  update(link: Link): Promise<void>;
  delete(link: Link): Promise<void>;
}
