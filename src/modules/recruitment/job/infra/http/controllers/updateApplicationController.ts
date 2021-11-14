import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateApplication } from '../../../useCases/updateApplication/updateApplication';
import { UpdateApplicationErrors } from '../../../useCases/updateApplication/updateApplicationError';
import { UpdateApplicationRequestDTO } from '../../../useCases/updateApplication/updateApplicationRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/jobs/applications/:id')
export class UpdateApplicationController extends BaseController {
  constructor(@inject(TYPES.UpdateApplication) private useCase: UpdateApplication) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateApplicationRequestDTO = req.body as UpdateApplicationRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, applicationId: id, updatedBy: req['context'] });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateApplicationErrors.ApplicationNotFoundError:
          case UpdateApplicationErrors.StepDoesNotExists:
            return this.notFound(res, error.errorValue().message);
          case UpdateApplicationErrors.ForbiddenError:
            return this.forbidden(res, error.errorValue().message);
          default:
            return this.clientError(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        return this.noContent(res);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
