import { JobState } from '../jobState';

export interface JobDTO {
  jobId?: string;
  name: string;
  description?: string;
  datePublished?: Date;
  startDate?: Date;
  vacancies?: number;
  technologies?: any[];
  processId: string;
  state?: JobState;
  createdBy: any;
  updatedBy?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
