import { ApplicationState } from '../applicationState';

export interface ApplicationDTO {
  applicationId?: string;
  dateOfApplication?: Date;
  otherInfo?: string;
  appliedBy: any;
  stepId: any;
  jobId: any;
  state?: ApplicationState;
}
