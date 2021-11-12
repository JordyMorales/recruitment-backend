import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateStep } from '../../../useCases/updateStep/updateStep';
import { UpdateStepErrors } from '../../../useCases/updateStep/updateStepError';
import { UpdateStepRequestDTO } from '../../../useCases/updateStep/updateStepRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/steps/:id')
export class UpdateStepController extends BaseController {
  constructor(@inject(TYPES.UpdateStep) private useCase: UpdateStep) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateStepRequestDTO = req.body as UpdateStepRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, stepId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateStepErrors.ProcessNotFoundError:
          case UpdateStepErrors.StepNotFoundError:
            return this.notFound(res, error.errorValue().message);
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
