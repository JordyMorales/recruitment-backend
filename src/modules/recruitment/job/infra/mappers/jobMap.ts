import { Job } from '../../domain/job';
import { JobDTO } from '../../domain/dtos/jobDTO';
import { ProcessId } from '../../domain/processId';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { UserMap } from '../../../../users/infra/mappers/userMap';
import { Technology } from '../../../candidate/domain/technology';
import { Result } from '../../../../../shared/core/Result';
import { TechnologyMap } from '../../../candidate/infra/mappers/technologyMap';

const technologiesToDomain = (technologies: any[]): Technology[] => {
  return technologies.map(({ technology_id, name }) => {
    const technologyOrError: Result<Technology> = Technology.create({ name }, technology_id);
    if (technologyOrError.isSuccess) return technologyOrError.getValue();
  });
};

export class JobMap implements Mapper<Job> {
  public static toDTO(job: Job): JobDTO {
    return {
      jobId: job.id.toString(),
      name: job.name,
      description: job.description ? job.description : null,
      datePublished: job.datePublished ? job.datePublished : null,
      startDate: job.startDate ? job.startDate : null,
      vacancies: job.vacancies ? job.vacancies : null,
      technologies: job.technologies ? job.technologies.map((t) => TechnologyMap.toDTO(t)) : [],
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
        datePublished: raw.date_published ? new Date(raw.date_published) : null,
        startDate: raw.start_date ? new Date(raw.start_date) : null,
        vacancies: raw.vacancies ? raw.vacancies : null,
        technologies: raw.technologies ? technologiesToDomain(raw.technologies) : [],
        processId: ProcessId.create(raw.process_id).getValue(),
        state: raw.state ? raw.state : null,
        createdBy: UserMap.toDomain(raw.jobCreatedBy),
        updatedBy: raw.updated_by ? UserMap.toDomain(raw.jobUpdatedBy) : null,
        createdAt: new Date(raw.created_at),
        updatedAt: raw.updated_at ? new Date(raw.updated_at) : null,
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
      technologies: job.technologies ? job.technologies.map((t) => TechnologyMap.toPersistence(t)) : [],
      process_id: job.processId.id.toString(),
      state: job.state ? job.state : null,
      created_by: job.createdBy.id.toString(),
      updated_by: job.updatedBy ? job.updatedBy.id.toString() : null,
      created_at: job.createdAt,
      updated_at: job.updatedAt ? job.updatedAt : null,
    };
  }
}
