import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { ApplicationMap } from '../../mappers/applicationMap';
import { GetJobApplications } from '../../../useCases/getJobApplications/getJobApplications';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetJobApplicationsErrors } from '../../../useCases/getJobApplications/getJobApplicationsErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/jobs/:id/applications')
export class GetJobApplicationsController extends BaseController {
  constructor(@inject(TYPES.GetJobApplications) private useCase: GetJobApplications) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ jobId: id });

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
