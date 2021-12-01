import { Step } from '../../domain/step';
import { StepDTO } from '../../domain/dtos/stepDTO';
import { ProcessId } from '../../domain/processId';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

export class StepMap implements Mapper<Step> {
  public static toDTO(step: Step): StepDTO {
    return {
      stepId: step.stepId.id.toString(),
      order: step.order,
      name: step.name,
      description: step.description ? step.description : null,
      processId: step.processId ? step.processId.toString() : null,
    };
  }

  public static toDomain(raw: any): Step {
    const stepOrError = Step.create(
      {
        order: raw.order,
        name: raw.name,
        description: raw.description ? raw.description : null,
        processId: raw.process_id ? ProcessId.create(raw.process_id).getValue() : null,
      },
      new UniqueEntityID(raw.step_id),
    );

    stepOrError.isFailure ? console.log(stepOrError.error) : '';

    return stepOrError.isSuccess ? stepOrError.getValue() : null;
  }

  public static toPersistence(step: Step): any {
    return {
      step_id: step.stepId.id.toString(),
      order: step.order,
      name: step.name,
      description: step.description ? step.description : null,
      process_id: step.processId ? step.processId.toString() : null,
    };
  }
}
