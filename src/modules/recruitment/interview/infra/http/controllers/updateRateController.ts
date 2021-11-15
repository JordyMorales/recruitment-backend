import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateRate } from '../../../useCases/updateRate/updateRate';
import { UpdateRateErrors } from '../../../useCases/updateRate/updateRateErrors';
import { UpdateRateRequestDTO } from '../../../useCases/updateRate/updateRateRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/interviews/rate/:id')
export class UpdateRateController extends BaseController {
  constructor(@inject(TYPES.UpdateRate) private useCase: UpdateRate) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateRateRequestDTO = req.body as UpdateRateRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, rateId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateRateErrors.RateNotFoundError:
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
