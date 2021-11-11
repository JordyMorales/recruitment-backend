import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateTechnology } from '../../../useCases/updateTechnology/updateTechnology';
import { UpdateTechnologyErrors } from '../../../useCases/updateTechnology/updateTechnologyError';
import { UpdateTechnologyRequestDTO } from '../../../useCases/updateTechnology/updateTechnologyRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/technologies/:id')
export class UpdateTechnologyController extends BaseController {
  constructor(@inject(TYPES.UpdateTechnology) private useCase: UpdateTechnology) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateTechnologyRequestDTO = req.body as UpdateTechnologyRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, technologyId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateTechnologyErrors.TechnologyNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.clientError(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
