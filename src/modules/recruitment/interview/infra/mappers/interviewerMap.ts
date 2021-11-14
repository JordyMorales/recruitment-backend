import { Interviewer } from '../../domain/interviewer';
import { InterviewerDTO } from '../../domain/dtos/interviewerDTO';
import { InterviewId } from '../../domain/interviewId';

export class InterviewerMap implements Mapper<Interviewer> {
  public static toDTO(interviewer: Interviewer): InterviewerDTO {
    return {
      interviewerId: interviewer.id.toString(),
      userId: interviewer.userId.id.toString(),
      interviewId: interviewer.interviewId.id.toString(),
    };
  }

  public static toDomain(raw: any): Interviewer {
    const interviewerOrError = Interviewer.create(
      {
        userId: UserId.create(raw.user_id).getValue(),
        interviewId: InterviewId.create(raw.interview_id).getValue(),
      },
      new UniqueEntityID(raw.interviewer_id),
    );

    interviewerOrError.isFailure ? console.log(interviewerOrError.error) : '';

    return interviewerOrError.isSuccess ? interviewerOrError.getValue() : null;
  }

  public static toPersistence(interviewer: Interviewer): any {
    return {
      interviewer_id: interviewer.id.toString(),
      user_id: interviewer.userId.id.toString(),
      interview_id: interviewer.interviewId.id.toString(),
    };
  }
}
