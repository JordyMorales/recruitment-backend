import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { CreateTechnology } from '../../../useCases/createTechnology/createTechnology';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { CreateTechnologyRequestDTO } from '../../../useCases/createTechnology/createTechnologyRequestDTO';
import { CreateTechnologyErrors } from '../../../useCases/createTechnology/createTechnologyErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/technologies')
export class CreateTechnologyController extends BaseController {
  constructor(@inject(TYPES.CreateTechnology) private useCase: CreateTechnology) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateTechnologyRequestDTO = req.body as CreateTechnologyRequestDTO;
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case CreateTechnologyErrors.TechnologyAlreadyExistsError:
            return this.conflict(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        return this.ok(res);
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
