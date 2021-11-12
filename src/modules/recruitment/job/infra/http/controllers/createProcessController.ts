import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { CreateProcessRequestDTO } from '../../../useCases/createProcess/createProcessRequestDTO';
import { CreateProcess } from '../../../useCases/createProcess/createProcess';
import { CreateProcessErrors } from '../../../useCases/createProcess/createProcessErrors';
import { ProcessMap } from '../../mappers/processMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/processes')
export class CreateProcessController extends BaseController {
  constructor(@inject(TYPES.CreateProcess) private useCase: CreateProcess) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateProcessRequestDTO = req.body as CreateProcessRequestDTO;
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case CreateProcessErrors.ProcessAlreadyExistsError:
            return this.conflict(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const processCreated = result.value.getValue();
        return this.created(res, {
          process: ProcessMap.toDTO(processCreated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
