import { Interviewer } from '../interviewer';
import { InterviewId } from '../interviewId';
import { UserId } from '../../../../users/domain/userId';

export interface IInterviewerRepo {
  exists(userId: UserId, interviewId: InterviewId): Promise<boolean>;
  getInterviewer(userId: UserId, interviewId: InterviewId): Promise<Interviewer>;
  save(interviewer: Interviewer): Promise<void>;
  update(interviewer: Interviewer): Promise<void>;
}
