import { injectable } from 'inversify';
import { Job } from '../../domain/job';
import { JobId } from '../../domain/jobId';
import { IJobRepo } from '../../domain/ports/IJobRepo';
import { JobMap } from '../mappers/jobMap';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class JobRepo implements IJobRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(jobId: JobId): Promise<boolean> {
    const JobModel = this.models.Job;
    const jobFound = await JobModel.findByPk(jobId.id.toString());
    return !!jobFound === true;
  }
  async getJobById(jobId: JobId): Promise<Job> {
    const JobModel = this.models.Job;
    const jobFound = await JobModel.findByPk(jobId.id.toString(), {
      include: [
        {
          model: this.models.User,
          as: 'jobCreatedBy',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'photo_url', 'state', 'role'],
        },
        {
          model: this.models.User,
          as: 'jobUpdatedBy',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'photo_url', 'state', 'role'],
        },
      ],
    });

    if (!!jobFound === false) throw new Error('Job not found.');

    return JobMap.toDomain(jobFound);
  }
  async search?(text?: string, page?: number, limit?: number): Promise<Job[]> {
    throw new Error('Method not implemented.');
  }
  async save(job: Job): Promise<void> {
    const JobModel = this.models.Job;
    try {
      const exists = await this.exists(job.jobId);
      if (!exists) {
        const raw = JobMap.toPersistence(job);
        await JobModel.create(raw);
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
  async update(job: Job): Promise<void> {
    const JobModel = this.models.Job;
    try {
      const exists = await this.exists(job.jobId);
      if (exists) {
        const raw = JobMap.toPersistence(job);
        await JobModel.update(raw, { where: { job_id: job.jobId.id.toString() } });
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
