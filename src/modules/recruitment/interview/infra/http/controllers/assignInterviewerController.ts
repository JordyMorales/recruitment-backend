import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { AssignInterviewer } from '../../../useCases/assignInterviewer/assignInterviewer';
import { AssignInterviewerErrors } from '../../../useCases/assignInterviewer/assignInterviewerErrors';
import { AssignInterviewerRequestDTO } from '../../../useCases/assignInterviewer/assignInterviewerRequestDTO';
import { InterviewerMap } from '../../mappers/interviewerMap';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/interviews/interviewers')
export class AssignInterviewerController extends BaseController {
  constructor(@inject(TYPES.AssignInterviewer) private useCase: AssignInterviewer) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: AssignInterviewerRequestDTO = req.body as AssignInterviewerRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AssignInterviewerErrors.InterviewerAlreadyAssignedError:
            return this.conflict(res, error.errorValue().message);
          case AssignInterviewerErrors.UserNotFoundError:
          case AssignInterviewerErrors.InterviewNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const interviewerAssigned = result.value.getValue();
        return this.created(res, {
          interviewer: InterviewerMap.toDTO(interviewerAssigned),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
