import { Rate } from '../../domain/rate';
import { RateDTO } from '../../domain/dtos/rateDTO';
import { InterviewId } from '../../domain/interviewId';
import { InterviewerId } from '../../domain/interviewerId';

export class RateMap implements Mapper<Rate> {
  public static toDTO(rate: Rate): RateDTO {
    return {
      rateId: rate.id.toString(),
      note: rate.note,
      rate: rate.rate,
      pros: rate.pros,
      cons: rate.cons,
      ratedAt: rate.createdAt ? rate.createdAt : null,
      ratedBy: rate.ratedBy.toString(),
      interviewId: rate.interviewId.id.toString(),
    };
  }

  public static toDomain(raw: any): Rate {
    const rateOrError = Rate.create(
      {
        note: raw.note,
        rate: raw.rate,
        pros: raw.pros,
        cons: raw.cons,
        ratedAt: raw.createdAt ? raw.created_at : null,
        ratedBy: InterviewerId.create(new UniqueEntityID(raw.rated_by)).getValue(),
        interviewId: InterviewId.create(new UniqueEntityID(raw.interview_id)).getValue(),
      },
      new UniqueEntityID(raw.rate_id),
    );

    rateOrError.isFailure ? console.log(rateOrError.error) : '';

    return rateOrError.isSuccess ? rateOrError.getValue() : null;
  }

  public static toPersistence(rate: Rate): any {
    return {
      rate_id: rate.id.toString(),
      note: rate.note,
      rate: rate.rate,
      pros: rate.pros,
      cons: rate.cons,
      rated_by: rate.ratedBy ? rate.ratedBy.toString() : null,
      interview_id: rate.interviewId ? rate.interviewId.id.toString() : null,
    };
  }
}
