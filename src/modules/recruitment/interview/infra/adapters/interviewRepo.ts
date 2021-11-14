import { injectable } from 'inversify';
import { Interview } from '../../domain/interview';
import { InterviewId } from '../../domain/interviewId';
import { ApplicationId } from '../../../job/domain/applicationId';
import { IInterviewRepo } from '../../domain/ports/IInterviewRepo';
import { InterviewMap } from '../mappers/interviewMap';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class InterviewRepo implements IInterviewRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(interviewId: InterviewId): Promise<boolean> {
    const InterviewModel = this.models.Interview;
    const interviewFound = await InterviewModel.findByPk(interviewId.id.toString());
    return !!interviewFound === true;
  }
  async getInterviewById(interviewId: InterviewId): Promise<Interview> {
    const InterviewModel = this.models.Interview;
    const interviewFound = await InterviewModel.findByPk(interviewId.id.toString());

    if (!!interviewFound === false) throw new Error('Interview not found.');

    return InterviewMap.toDomain(interviewFound);
  }
  async getAllApplicationInterviews(applicationId: ApplicationId): Promise<Interview[]> {
    const InterviewModel = this.models.Interview;
    const interviews = await InterviewModel.findAll({
      where: { application_id: applicationId.id.toString() },
    });
    return interviews.map((interview) => InterviewMap.toDomain(interview));
  }
  async save(interview: Interview): Promise<void> {
    const InterviewModel = this.models.Interview;
    try {
      const exists = await this.exists(interview.interviewId);
      if (!exists) {
        const raw = InterviewMap.toPersistence(interview);
        await InterviewModel.create(raw);
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async update(interview: Interview): Promise<void> {
    const InterviewModel = this.models.Interview;
    try {
      const exists = await this.exists(interview.interviewId);
      if (exists) {
        const raw = InterviewMap.toPersistence(interview);
        await InterviewModel.update(raw, { where: { interview_id: interview.interviewId.id.toString() } });
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
}
