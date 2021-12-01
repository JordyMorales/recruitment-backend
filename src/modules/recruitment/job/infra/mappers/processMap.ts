import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { ProcessDTO } from '../../domain/dtos/processDTO';
import { Process } from '../../domain/process';
import { Step } from '../../domain/step';
import { StepMap } from './stepMap';

const stepsToDomain = (steps: any[]): Step[] => {
  return steps.map(({ step_id, order, name, description, process_id: processId }) => {
    const stepOrError: Result<Step> = Step.create({ order, name, description, processId }, step_id);
    if (stepOrError.isSuccess) return stepOrError.getValue();
  });
};

export class ProcessMap implements Mapper<Process> {
  public static toDTO(process: Process): ProcessDTO {
    return {
      processId: process.id.toString(),
      code: process.code,
      name: process.name,
      description: process.description ? process.description : null,
      steps: process.steps.length ? process.steps.map((step) => StepMap.toDTO(step)) : [],
    };
  }

  public static toDomain(raw: any): Process {
    const processOrError = Process.create(
      {
        code: raw.code,
        name: raw.name,
        description: raw.description ? raw.description : null,
        steps: raw.steps ? stepsToDomain(raw.steps) : [],
      },
      new UniqueEntityID(raw.process_id),
    );

    processOrError.isFailure ? console.log(processOrError.error) : '';

    return processOrError.isSuccess ? processOrError.getValue() : null;
  }

  public static toPersistence(process: Process): any {
    return {
      process_id: process.id.toString(),
      code: process.code,
      name: process.name,
      description: process.description ? process.description : null,
      steps: process.steps.length ? process.steps.map((step) => StepMap.toPersistence(step)) : [],
    };
  }
}
