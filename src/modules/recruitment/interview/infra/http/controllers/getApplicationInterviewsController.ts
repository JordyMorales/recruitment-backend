import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { InterviewMap } from '../../mappers/interviewMap';
import { GetApplicationInterviews } from '../../../useCases/getApplicationInterviews/getApplicationInterviews';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetApplicationInterviewsErrors } from '../../../useCases/getApplicationInterviews/getApplicationInterviewsErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/jobs/applications/:id/interviews')
export class GetApplicationInterviewsController extends BaseController {
  constructor(@inject(TYPES.GetApplicationInterviews) private useCase: GetApplicationInterviews) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ applicationId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case GetApplicationInterviewsErrors.ApplicationNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const interviews = result.value.getValue();
        return this.ok(res, {
          interviews: interviews.map((step) => InterviewMap.toDTO(step)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
