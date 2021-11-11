import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { CreateTag } from '../../../useCases/createTag/createTag';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { CreateTagRequestDTO } from '../../../useCases/createTag/createTagRequestDTO';
import { CreateTagErrors } from '../../../useCases/createTag/createTagErrors';
import { TagMap } from '../../mappers/tagMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/tags')
export class CreateTagController extends BaseController {
  constructor(@inject(TYPES.CreateTag) private useCase: CreateTag) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateTagRequestDTO = req.body as CreateTagRequestDTO;
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case CreateTagErrors.TagAlreadyExistsError:
            return this.conflict(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const tagCreated = result.value.getValue();
        return this.created(res, {
          tag: TagMap.toDTO(tagCreated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
