import { Interviewer } from '../interviewer';
import { InterviewId } from '../interviewId';
import { UserId } from '../../../users/domain/userId';

export interface IInterviewerRepo {
  exists(userId: UserId, interviewId: InterviewId): Promise<boolean>;
  getInterviewerById(interviewerId: InterviewId): Promise<Interviewer>;
  save(interviewer: Interviewer): Promise<void>;
  update(interviewer: Interviewer): Promise<void>;
}
