import { Interview } from '../../domain/interview';
import { InterviewDTO } from '../../domain/dtos/interviewDTO';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { StepId } from '../../../job/domain/stepId';
import { ApplicationId } from '../../../job/domain/applicationId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
export class InterviewMap implements Mapper<Interview> {
  public static toDTO(interview: Interview): InterviewDTO {
    return {
      interviewId: interview.interviewId.id.toString(),
      topic: interview.topic,
      description: interview.description ? interview.description : null,
      applicationId: interview.applicationId.id.toString(),
      scheduledAt: interview.scheduledAt,
      duration: interview.duration,
      triggeredAt: interview.triggeredAt,
      stepId: interview.stepId.id.toString(),
    };
  }

  public static toDomain(raw: any): Interview {
    const interviewOrError = Interview.create(
      {
        topic: raw.topic,
        description: raw.description ? raw.description : null,
        applicationId: ApplicationId.create(raw.application_id).getValue(),
        scheduledAt: raw.scheduledAt,
        duration: raw.duration,
        triggeredAt: raw.triggeredAt,
        stepId: StepId.create(raw.step_id).getValue(),
      },
      new UniqueEntityID(raw.interview_id),
    );

    interviewOrError.isFailure ? console.log(interviewOrError.error) : '';

    return interviewOrError.isSuccess ? interviewOrError.getValue() : null;
  }

  public static toPersistence(interview: Interview): any {
    return {
      interview_id: interview.interviewId.id.toString(),
      topic: interview.topic,
      description: interview.description ? interview.description : null,
      application_id: interview.applicationId.id.toString(),
      scheduled_at: interview.scheduledAt,
      duration: interview.duration,
      triggered_at: interview.triggeredAt,
      step_id: interview.stepId.id.toString(),
    };
  }
}
