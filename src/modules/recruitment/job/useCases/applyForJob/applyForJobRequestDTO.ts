import { ApplicationState } from '../../domain/applicationState';

export interface ApplyForJobRequestDTO {
  dateOfApplication?: Date;
  otherInfo?: string;
  appliedBy: string;
  stepId?: string;
  jobId: string;
  state?: ApplicationState;
}
