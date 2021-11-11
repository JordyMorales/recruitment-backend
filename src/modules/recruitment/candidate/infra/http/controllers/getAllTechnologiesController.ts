import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { TechnologyMap } from '../../mappers/technologyMap';
import { GetAllTechnologies } from '../../../useCases/getAllTechnologies/getAllTechnologies';
import { isAuthenticated } from '../../../../../../shared/infra/http/middlewares';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/technologies')
export class GetAllTechnologiesController extends BaseController {
  constructor(@inject(TYPES.GetAllTechnologies) private useCase: GetAllTechnologies) {
    super();
  }

  @httpGet('/', isAuthenticated)
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message);
      } else {
        const technologies = result.value.getValue();
        return this.ok(res, {
          technologies: technologies.map((tag) => TechnologyMap.toDTO(tag)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
