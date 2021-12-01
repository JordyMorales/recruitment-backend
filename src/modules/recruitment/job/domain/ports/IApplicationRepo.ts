import { JobId } from '../jobId';
import { StepId } from '../stepId';
import { Application } from '../application';
import { ApplicationId } from '../applicationId';
import { CandidateId } from '../../../candidate/domain/candidateId';

export interface IApplicationRepo {
  exists(candidateId: CandidateId, jobId: JobId): Promise<boolean>;
  getApplicationById(applicationId: ApplicationId): Promise<Application>;
  getJobApplications(jobId: JobId): Promise<Application[]>;
  getCandidateApplications(candidateId: CandidateId): Promise<Application[]>;
  getStepApplications(stepId: StepId, jobId: JobId): Promise<Application[]>;
  save(application: Application): Promise<void>;
  update(application: Application): Promise<void>;
}
