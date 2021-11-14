import { Interview } from '../interview';
import { InterviewId } from '../interviewId';
import { ApplicationId } from '../../../job/domain/applicationId';

export interface IInterviewRepo {
  exists(interviewId: InterviewId): Promise<boolean>;
  getInterviewById(interviewId: InterviewId): Promise<Interview>;
  getAllApplicationInterviews(applicationId: ApplicationId): Promise<Interview[]>;
  save(interview: Interview): Promise<void>;
  update(interview: Interview): Promise<void>;
}
