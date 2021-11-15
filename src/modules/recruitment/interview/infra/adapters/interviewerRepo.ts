import { injectable } from 'inversify';
import { UserId } from '../../../../users/domain/userId';
import { Interviewer } from '../../domain/interviewer';
import { InterviewId } from '../../domain/interviewId';
import { IInterviewerRepo } from '../../domain/ports/IInterviewerRepo';
import models from '../../../../../shared/infra/database/sequelize/models';
import { InterviewerMap } from '../mappers/interviewerMap';

@injectable()
export class InterviewerRepo implements IInterviewerRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(userId: UserId, interviewId: InterviewId): Promise<boolean> {
    const InterviewerModel = this.models.Interviewer;
    const interviewerFound = await InterviewerModel.findOne({
      where: { user_id: userId.id.toString(), interview_id: interviewId.id.toString() },
    });
    return !!interviewerFound === true;
  }
  async getInterviewerById(interviewerId: InterviewId): Promise<Interviewer> {
    const InterviewerModel = this.models.Interviewer;
    const interviewerFound = await InterviewerModel.findByPk(interviewerId.id.toString());

    if (!!interviewerFound === false) throw new Error('Interviewer not found.');

    return InterviewerMap.toDomain(interviewerFound);
  }
  async save(interviewer: Interviewer): Promise<void> {
    const InterviewerModel = this.models.Interviewer;
    try {
      const exists = await this.exists(interviewer.userId, interviewer.interviewId);
      if (!exists) {
        const raw = InterviewerMap.toPersistence(interviewer);
        await InterviewerModel.create(raw);
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
  async update(interviewer: Interviewer): Promise<void> {
    const InterviewerModel = this.models.Interviewer;
    try {
      const exists = await this.exists(interviewer.userId, interviewer.interviewId);
      if (exists) {
        const raw = InterviewerMap.toPersistence(interviewer);
        await InterviewerModel.update(raw, {
          where: { interviewer_id: interviewer.interviewerId.id.toString() },
        });
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
