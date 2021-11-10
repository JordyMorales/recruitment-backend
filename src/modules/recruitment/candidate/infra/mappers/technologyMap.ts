import { Technology } from '../../domain/technology';
import { TechnologyDTO } from '../../domain/dtos/technologyDTO';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

export class TechnologyMap implements Mapper<Technology> {
  public static toDTO(technology: Technology): TechnologyDTO {
    return {
      technologyId: technology.technologyId.id.toString(),
      name: technology.name.toString(),
    };
  }

  public static toDomain(raw: any): Technology {
    const technologyOrError = Technology.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.technology_id),
    );

    technologyOrError.isFailure ? console.log(technologyOrError.error) : '';

    return technologyOrError.isSuccess ? technologyOrError.getValue() : null;
  }

  public static toPersistence(technology: Technology): any {
    return {
      technology_id: technology.technologyId.id.toString(),
      name: technology.name.toString(),
    };
  }
}
