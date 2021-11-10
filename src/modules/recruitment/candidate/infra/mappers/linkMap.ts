import { Link } from '../../domain/link';
import { LinkDTO } from '../../domain/dtos/linkDTO';
import { CandidateId } from '../../domain/candidateId';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

export class LinkMap implements Mapper<Link> {
  public static toDTO(link: Link): LinkDTO {
    return {
      linkId: link.id.toString(),
      value: link.value,
      candidateId: link.candidateId.id.toString(),
    };
  }

  public static toDomain(raw: any): Link {
    const linkOrError = Link.create(
      {
        value: raw.value,
        candidateId: CandidateId.create(raw.candidate_id).getValue(),
      },
      new UniqueEntityID(raw.link_id),
    );

    linkOrError.isFailure ? console.log(linkOrError.error) : '';

    return linkOrError.isSuccess ? linkOrError.getValue() : null;
  }

  public static toPersistence(link: Link): any {
    return {
      link_id: link.id.toString(),
      value: link.value,
      candidate_id: link.candidateId ? link.candidateId.id.toString() : null,
    };
  }
}
