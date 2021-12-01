import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { GetAllProcesses } from '../../../useCases/getAllProcesses/getAllProcesses';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { ProcessMap } from '../../mappers/processMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/processes')
export class GetAllProcessesController extends BaseController {
  constructor(@inject(TYPES.GetAllProcesses) private useCase: GetAllProcesses) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message);
      } else {
        const processes = result.value.getValue();
        return this.ok(res, {
          processes: processes.map((process) => ProcessMap.toDTO(process)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
