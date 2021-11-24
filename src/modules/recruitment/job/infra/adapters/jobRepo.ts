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
        { model: this.models.Technology },
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
  async getAllJobs(): Promise<Job[]> {
    const JobModel = this.models.Job;
    const jobs = await JobModel.findAll({
      include: [
        { model: this.models.Technology },
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
    return jobs.map((job) => JobMap.toDomain(job));
  }
  async search?(text?: string, page?: number, limit?: number): Promise<Job[]> {
    throw new Error('Method not implemented.');
  }
  async save(job: Job): Promise<void> {
    const JobModel = this.models.Job;
    const transaction = await models['sequelize'].transaction();
    try {
      const raw = JobMap.toPersistence(job);
      const jobCreated = await JobModel.create(raw, { transaction });

      await Promise.all(
        raw.technologies.map(async (tech) => {
          const techFound = await this.models.Technology.findOne({ where: { name: tech.name } });
          if (!!techFound === false) {
            const resp = await this.models.Technology.create(tech, { transaction });
            await jobCreated.addTechnology(resp, { transaction });
          } else {
            await jobCreated.addTechnology(techFound, { transaction });
          }
        }),
      );
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw new Error(error.toString());
    }
  }
  async update(job: Job): Promise<void> {
    const JobModel = this.models.Job;
    const transaction = await models['sequelize'].transaction();
    try {
      const raw = JobMap.toPersistence(job);
      const jobInstance = await JobModel.findByPk(job.jobId.id.toString());
      await jobInstance.update(raw, { transaction });

      await jobInstance.setTechnologies([], { transaction });

      await Promise.all(
        raw.technologies.map(async (tech) => {
          const techFound = await this.models.Technology.findOne({ where: { name: tech.name } });
          if (!!techFound === false) {
            const techCreated = await this.models.Technology.create(tech, { transaction });
            await jobInstance.addTechnology(techCreated, { transaction });
          } else {
            await jobInstance.addTechnology(techFound, { transaction });
          }
        }),
      );
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw new Error(error.toString());
    }
  }
}
