import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateTag } from '../../../useCases/updateTag/updateTag';
import { UpdateTagErrors } from '../../../useCases/updateTag/updateTagError';
import { UpdateTagRequestDTO } from '../../../useCases/updateTag/updateTagRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/tags/:id')
export class UpdateTagController extends BaseController {
  constructor(@inject(TYPES.UpdateTag) private useCase: UpdateTag) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateTagRequestDTO = req.body as UpdateTagRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, tagId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateTagErrors.TagNotFoundError:
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
