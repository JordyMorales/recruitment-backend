import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { ProcessDTO } from '../../domain/dtos/processDTO';
import { Process } from '../../domain/process';

export class ProcessMap implements Mapper<Process> {
  public static toDTO(process: Process): ProcessDTO {
    return {
      processId: process.id.toString(),
      code: process.code,
      name: process.name,
      description: process.description ? process.description : null,
    };
  }

  public static toDomain(raw: any): Process {
    const processOrError = Process.create(
      {
        code: raw.code,
        name: raw.name,
        description: raw.description ? raw.description : null,
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
    };
  }
}
