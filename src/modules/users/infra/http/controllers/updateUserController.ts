import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateUser } from '../../../useCases/updateUser/updateUser';
import { UpdateUserErrors } from '../../../useCases/updateUser/updateUserError';
import { UpdateUserRequestDTO } from '../../../useCases/updateUser/updateUserRequestDTO';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../shared/infra/constants/types';

@controller('/api/v1/users/:id')
export class UpdateUserController extends BaseController {
  constructor(@inject(TYPES.UpdateUser) private useCase: UpdateUser) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'], allowSame: true }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateUserRequestDTO = req.body as UpdateUserRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, userId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateUserErrors.UserNotFoundError:
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
