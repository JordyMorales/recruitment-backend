import { JobId } from '../../domain/jobId';
import { StepId } from '../../domain/stepId';
import { Application } from '../../domain/application';
import { ApplicationDTO } from '../../domain/dtos/applicationDTO';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Mapper } from '../../../../../shared/infra/Mapper';

export class ApplicationMap implements Mapper<Application> {
  public static toDTO(application: Application): ApplicationDTO {
    return {
      applicationId: application.id.toString(),
      dateOfApplication: application.dateOfApplication,
      otherInfo: application.otherInfo ? application.otherInfo : null,
      appliedBy: application.appliedBy.id.toString(),
      stepId: application.stepId.id.toString(),
      jobId: application.jobId.id.toString(),
      state: application.state ? application.state : null,
    };
  }

  public static toDomain(raw: any): Application {
    const applicationOrError = Application.create(
      {
        dateOfApplication: raw.date_of_application,
        otherInfo: raw.other_info ? raw.other_info : null,
        appliedBy: raw.applied_by,
        stepId: StepId.create(raw.step_id).getValue(),
        jobId: JobId.create(raw.job_id).getValue(),
        state: raw.state ? raw.state : null,
      },
      new UniqueEntityID(raw.application_id),
    );

    applicationOrError.isFailure ? console.log(applicationOrError.error) : '';

    return applicationOrError.isSuccess ? applicationOrError.getValue() : null;
  }

  public static toPersistence(application: Application): any {
    return {
      application_id: application.id.toString(),
      date_of_application: application.dateOfApplication,
      other_info: application.otherInfo ? application.otherInfo : null,
      applied_by: application.appliedBy.id.toString(),
      step_id: application.stepId.id.toString(),
      job_id: application.jobId.id.toString(),
      state: application.state ? application.state : null,
    };
  }
}
