import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { SearchTechnologies } from '../../../useCases/searchTechnologies/searchTechnologies';
import { isAuthenticated } from '../../../../../../shared/infra/http/middlewares';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { TechnologyMap } from '../../mappers/technologyMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/technologies/search')
export class SearchTechnologiesController extends BaseController {
  constructor(@inject(TYPES.SearchTechnologies) private useCase: SearchTechnologies) {
    super();
  }

  @httpGet('/', isAuthenticated)
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const isActive = req.query.isActive ? JSON.parse(req.query.isActive.toString()) : true;

    try {
      const result = await this.useCase.execute({ isActive });

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message);
      } else {
        const technologies = result.value.getValue();
        return this.ok(res, {
          technologies: technologies.map((technology) => TechnologyMap.toDTO(technology)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
