import { injectable } from 'inversify';
import { UserId } from '../../../../users/domain/userId';
import { Interviewer } from '../../domain/interviewer';
import { InterviewId } from '../../domain/interviewId';
import { IInterviewerRepo } from '../../domain/ports/IInterviewerRepo';
import models from '../../../../../shared/infra/database/sequelize/models';

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
    throw new Error('Method not implemented.');
  }
  async save(interviewer: Interviewer): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async update(interviewer: Interviewer): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
