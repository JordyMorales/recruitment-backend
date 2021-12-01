import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { ApplicationMap } from '../../mappers/applicationMap';
import { GetApplicationById } from '../../../useCases/getApplicationById/getApplicationById';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetApplicationByIdErrors } from '../../../useCases/getApplicationById/getApplicationByIdErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/jobs/applications/:id')
export class GetApplicationByIdController extends BaseController {
  constructor(@inject(TYPES.GetApplicationById) private useCase: GetApplicationById) {
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
          case GetApplicationByIdErrors.ApplicationNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const application = result.value.getValue();
        return this.ok(res, {
          application: ApplicationMap.toDTO(application),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
