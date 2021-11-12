import { Job } from '../job';
import { JobId } from '../jobId';

export interface IJobRepo {
  exists(jobId: JobId): Promise<boolean>;
  getJobById(jobId: JobId): Promise<Job>;
  search?(text?: string, page?: number, limit?: number): Promise<Job[]>;
  save(job: Job): Promise<void>;
  update(job: Job): Promise<void>;
}
