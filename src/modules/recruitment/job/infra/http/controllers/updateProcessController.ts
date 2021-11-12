import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateProcess } from '../../../useCases/updateProcess/updateProcess';
import { UpdateProcessErrors } from '../../../useCases/updateProcess/updateProcessError';
import { UpdateProcessRequestDTO } from '../../../useCases/updateProcess/updateProcessRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/processes/:id')
export class UpdateProcessController extends BaseController {
  constructor(@inject(TYPES.UpdateProcess) private useCase: UpdateProcess) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateProcessRequestDTO = req.body as UpdateProcessRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, processId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateProcessErrors.ProcessNotFoundError:
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
