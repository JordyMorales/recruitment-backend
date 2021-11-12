import { injectable } from 'inversify';
import { IStepRepo } from '../../domain/ports/IStepRepo';
import { ProcessId } from '../../domain/processId';
import { Step } from '../../domain/step';
import { StepId } from '../../domain/stepId';
import { StepMap } from '../mappers/stepMap';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class StepRepo implements IStepRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(stepId: StepId): Promise<boolean> {
    const StepModel = this.models.Step;
    const stepFound = await StepModel.findByPk(stepId.id.toString());
    return !!stepFound === true;
  }
  async getStepById(stepId: StepId): Promise<Step> {
    const StepModel = this.models.Step;
    const stepFound = await StepModel.findByPk(stepId.id.toString());

    if (!!stepFound === false) throw new Error('Step not found.');

    return StepMap.toDomain(stepFound);
  }
  async getAllProcessesSteps(processId: ProcessId): Promise<Step[]> {
    const StepModel = this.models.Step;
    const steps = await StepModel.findAll({
      where: { process_id: processId.id.toString() },
    });
    return steps.map((step) => StepMap.toDomain(step));
  }
  async save(step: Step): Promise<void> {
    const StepModel = this.models.Step;
    try {
      const exists = await this.exists(step.stepId);
      if (!exists) {
        const raw = StepMap.toPersistence(step);
        await StepModel.create(raw);
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async update(step: Step): Promise<void> {
    const StepModel = this.models.Step;
    try {
      const exists = await this.exists(step.stepId);
      if (exists) {
        const raw = StepMap.toPersistence(step);
        await StepModel.update(raw, { where: { step_id: step.stepId.id.toString() } });
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
}
