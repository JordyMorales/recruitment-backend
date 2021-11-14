import { ApplicationState } from './../../domain/applicationState';

export interface UpdateApplicationRequestDTO {
  applicationId?: string;
  otherInfo?: string;
  stepId: string;
  state?: ApplicationState;
  updatedBy?: any;
}
