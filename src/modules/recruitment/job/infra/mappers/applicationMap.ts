import { JobId } from '../../domain/jobId';
import { StepId } from '../../domain/stepId';
import { Application } from '../../domain/application';
import { ApplicationDTO } from '../../domain/dtos/applicationDTO';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { Candidate } from '../../../candidate/domain/candidate';
import { UserMap } from '../../../../users/infra/mappers/userMap';
import { StepMap } from './stepMap';

export class ApplicationMap implements Mapper<Application> {
  public static toDTO(application: Application): ApplicationDTO {
    const { personalData } = application.appliedBy;
    return {
      applicationId: application.id.toString(),
      otherInfo: application.otherInfo ? application.otherInfo : null,
      appliedBy: {
        candidateId: application.appliedBy.candidateId.id.toString(),
        firstName: personalData.firstName ? personalData.firstName : null,
        lastName: personalData.lastName ? personalData.lastName : null,
        email: personalData.email ? personalData.email.value : null,
        photoUrl: personalData.photoUrl ? personalData.photoUrl : null,
      },
      step: StepMap.toDTO(application.step),
      jobId: application.jobId.id.toString(),
      state: application.state ? application.state : null,
      appliedAt: application.appliedAt,
      updatedAt: application.updatedAt ? application.updatedAt : null,
    };
  }

  public static toDomain(raw: any): Application {
    const appliedBy = Candidate.create(
      { personalData: UserMap.toDomain(raw.candidate.user) },
      new UniqueEntityID(raw.candidate.candidate_id),
    );

    const applicationOrError = Application.create(
      {
        otherInfo: raw.other_info ? raw.other_info : null,
        appliedBy: appliedBy.getValue(),
        step: StepMap.toDomain(raw.step),
        jobId: JobId.create(raw.job_id).getValue(),
        state: raw.state ? raw.state : null,
        appliedAt: raw.applied_at,
        updatedAt: raw.updated_at ? raw.updated_at : null,
      },
      new UniqueEntityID(raw.application_id),
    );

    applicationOrError.isFailure ? console.log(applicationOrError.error) : '';

    return applicationOrError.isSuccess ? applicationOrError.getValue() : null;
  }

  public static toPersistence(application: Application): any {
    return {
      application_id: application.id.toString(),
      other_info: application.otherInfo ? application.otherInfo : null,
      applied_by: application.appliedBy.id.toString(),
      step_id: application.step.stepId.id.toString(),
      job_id: application.jobId.id.toString(),
      state: application.state ? application.state : null,
      applied_at: application.appliedAt,
      updated_at: application.updatedAt ? application.updatedAt : null,
    };
  }
}
