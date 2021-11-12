import { Comment } from '../comment';
import { CandidateId } from '../candidateId';

export interface ICommentRepo {
  getCandidateComments(candidateId: CandidateId): Promise<Comment[]>;
  save(comment: Comment): Promise<void>;
  update(comment: Comment): Promise<void>;
  delete(comment: Comment): Promise<void>;
}