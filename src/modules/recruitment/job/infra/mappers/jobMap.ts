import { Job } from '../../domain/job';
import { JobDTO } from '../../domain/dtos/jobDTO';
import { ProcessId } from '../../domain/processId';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { UserMap } from '../../../../users/infra/mappers/userMap';

export class JobMap implements Mapper<Job> {
  public static toDTO(job: Job): JobDTO {
    return {
      jobId: job.id.toString(),
      name: job.name,
      description: job.description ? job.description : null,
      datePublished: job.datePublished ? job.datePublished : null,
      startDate: job.startDate ? job.startDate : null,
      vacancies: job.vacancies ? job.vacancies : null,
      processId: job.processId.id.toString(),
      state: job.state ? job.state : null,
      createdBy: UserMap.toDTO(job.createdBy),
      updatedBy: job.updatedBy ? UserMap.toDTO(job.updatedBy) : null,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt ? job.updatedAt : null,
    };
  }

  public static toDomain(raw: any): Job {
    const jobOrError = Job.create(
      {
        name: raw.name,
        description: raw.description ? raw.description : null,
        datePublished: raw.datePublished ? raw.datePublished : null,
        startDate: raw.startDate ? raw.startDate : null,
        vacancies: raw.vacancies ? raw.vacancies : null,
        processId: ProcessId.create(raw.process_id).getValue(),
        state: raw.state ? raw.state : null,
        createdBy: UserMap.toDomain(raw.createdBy),
        updatedBy: raw.updated_by ? UserMap.toDomain(raw.updatedBy) : null,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at ? raw.updated_at : null,
      },
      new UniqueEntityID(raw.job_id),
    );

    jobOrError.isFailure ? console.log(jobOrError.error) : '';

    return jobOrError.isSuccess ? jobOrError.getValue() : null;
  }

  public static toPersistence(job: Job): any {
    return {
      job_id: job.id.toString(),
      name: job.name,
      description: job.description ? job.description : null,
      date_published: job.datePublished ? job.datePublished : null,
      start_date: job.startDate ? job.startDate : null,
      vacancies: job.vacancies ? job.vacancies : null,
      process_id: job.processId.id.toString(),
      state: job.state ? job.state : null,
      created_by: job.createdBy.id.toString(),
      updated_by: job.updatedBy ? job.updatedBy.id.toString() : null,
      created_at: job.createdAt,
      updated_at: job.updatedAt ? job.updatedAt : null,
    };
  }
}
