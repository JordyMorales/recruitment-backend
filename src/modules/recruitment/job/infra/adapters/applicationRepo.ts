import { injectable } from 'inversify';
import { JobId } from '../../domain/jobId';
import { StepId } from '../../domain/stepId';
import { CandidateId } from '../../../candidate/domain/candidateId';
import { ApplicationId } from '../../domain/applicationId';
import { Application } from '../../domain/application';
import { ApplicationMap } from '../mappers/applicationMap';
import { IApplicationRepo } from '../../domain/ports/IApplicationRepo';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class ApplicationRepo implements IApplicationRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(appliedBy: CandidateId, jobId: JobId): Promise<boolean> {
    const ApplicationModel = this.models.Application;
    const applicationFound = await ApplicationModel.findOne({
      where: { applied_by: appliedBy.id.toString(), job_id: jobId.id.toString() },
    });
    return !!applicationFound === true;
  }
  async getApplicationById(applicationId: ApplicationId): Promise<Application> {
    const ApplicationModel = this.models.Application;
    const applicationFound = await ApplicationModel.findByPk(applicationId.id.toString(), {
      include: [
        {
          model: this.models.Candidate,
          attributes: ['candidate_id'],
          include: [
            {
              model: this.models.User,
              as: 'user',
              attributes: ['user_id', 'first_name', 'last_name', 'email', 'photo_url'],
            },
          ],
        },
        { model: this.models.Step },
      ],
    });
    if (!!applicationFound === false) throw new Error('Application not found.');
    return ApplicationMap.toDomain(applicationFound);
  }
  async getJobApplications(jobId: JobId): Promise<Application[]> {
    const ApplicationModel = this.models.Application;
    const applications = await ApplicationModel.findAll({
      where: { job_id: jobId.id.toString() },
      include: [
        {
          model: this.models.Candidate,
          attributes: ['candidate_id'],
          include: [
            {
              model: this.models.User,
              as: 'user',
              attributes: ['user_id', 'first_name', 'last_name', 'email', 'photo_url', 'state', 'role'],
            },
          ],
        },
        { model: this.models.Step },
      ],
    });
    return applications.map((application) => ApplicationMap.toDomain(application));
  }
  async getStepApplications(stepId: StepId): Promise<Application[]> {
    const ApplicationModel = this.models.Application;
    const applications = await ApplicationModel.findAll({
      where: { step_id: stepId.id.toString() },
      include: [
        {
          model: this.models.Candidate,
          attributes: ['candidate_id'],
          include: [
            {
              model: this.models.User,
              as: 'user',
              attributes: ['user_id', 'first_name', 'last_name', 'email', 'photo_url', 'state', 'role'],
            },
          ],
        },
        { model: this.models.Step },
      ],
    });
    return applications.map((application) => ApplicationMap.toDomain(application));
  }
  async save(application: Application): Promise<void> {
    const ApplicationModel = this.models.Application;
    try {
      const exists = await this.exists(application.appliedBy, application.jobId);
      if (!exists) {
        const raw = ApplicationMap.toPersistence(application);
        await ApplicationModel.create(raw);
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
  async update(application: Application): Promise<void> {
    const ApplicationModel = this.models.Application;
    try {
      const exists = await this.exists(application.appliedBy, application.jobId);
      if (exists) {
        const raw = ApplicationMap.toPersistence(application);
        await ApplicationModel.update(raw, {
          where: { application_id: application.applicationId.id.toString() },
        });
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
