import { ApplicationState } from '../applicationState';

export interface ApplicationDTO {
  applicationId?: string;
  otherInfo?: string;
  appliedBy: any;
  step: any;
  jobId: any;
  state?: ApplicationState;
  appliedAt: Date;
  updatedAt: Date;
}
