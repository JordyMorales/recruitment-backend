import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { ApplicationMap } from '../../mappers/applicationMap';
import { GetStepApplications } from '../../../useCases/getStepApplications/getStepApplications';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetJobApplicationsErrors } from '../../../useCases/getJobApplications/getJobApplicationsErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/steps/:stepId/:jobId/applications')
export class GetStepApplicationsController extends BaseController {
  constructor(@inject(TYPES.GetStepApplications) private useCase: GetStepApplications) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { stepId, jobId } = req.params;

    try {
      const result = await this.useCase.execute({ stepId, jobId });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case GetJobApplicationsErrors.JobNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const applications = result.value.getValue();
        return this.ok(res, {
          applications: applications.map((step) => ApplicationMap.toDTO(step)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
