import { Step } from '../step';
import { StepId } from '../stepId';
import { ProcessId } from '../processId';

export interface IStepRepo {
  exists(stepId: StepId): Promise<boolean>;
  getStepById(stepId: StepId): Promise<Step>;
  getAllProcessesSteps(processId: ProcessId): Promise<Step[]>;
  save(step: Step): Promise<void>;
  update(step: Step): Promise<void>;
}
