import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { ProcessMap } from '../../mappers/processMap';
import { GetProcessById } from '../../../useCases/getProcessById/getProcessById';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetProcessByIdErrors } from '../../../useCases/getProcessById/getProcessByIdErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/processes/:id')
export class GetProcessByIdController extends BaseController {
  constructor(@inject(TYPES.GetProcessById) private useCase: GetProcessById) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'], allowSame: true }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ processId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case GetProcessByIdErrors.ProcessNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const process = result.value.getValue();
        return this.ok(res, {
          process: ProcessMap.toDTO(process),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
