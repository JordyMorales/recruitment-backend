export interface UpdateStepRequestDTO {
  stepId?: string;
  order: number;
  name: string;
  description?: string;
  processId: string;
}
