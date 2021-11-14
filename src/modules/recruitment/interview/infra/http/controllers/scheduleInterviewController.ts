import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { ScheduleInterview } from '../../../useCases/scheduleInterview/scheduleInterview';
import { ScheduleInterviewErrors } from '../../../useCases/scheduleInterview/scheduleInterviewErrors';
import { ScheduleInterviewRequestDTO } from '../../../useCases/scheduleInterview/scheduleInterviewRequestDTO';
import { InterviewMap } from '../../mappers/interviewMap';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/interviews')
export class ScheduleInterviewController extends BaseController {
  constructor(@inject(TYPES.ScheduleInterview) private useCase: ScheduleInterview) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: ScheduleInterviewRequestDTO = req.body as ScheduleInterviewRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ScheduleInterviewErrors.ApplicationNotFoundError:
          case ScheduleInterviewErrors.StepNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const interviewCreated = result.value.getValue();
        return this.created(res, {
          interview: InterviewMap.toDTO(interviewCreated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
