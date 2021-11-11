import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { SearchTags } from '../../../useCases/searchTags/searchTags';
import { isAuthenticated } from '../../../../../../shared/infra/http/middlewares';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { TagMap } from '../../mappers/tagMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/tags/search')
export class SearchTagsController extends BaseController {
  constructor(@inject(TYPES.SearchTags) private useCase: SearchTags) {
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
        const tags = result.value.getValue();
        return this.ok(res, {
          tags: tags.map((tag) => TagMap.toDTO(tag)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
