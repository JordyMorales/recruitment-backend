import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { GetUserById } from '../../../useCases/getUserById/getUserById';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated } from '../../../../../shared/infra/http/middlewares';
import { GetUserByIdErrors } from '../../../useCases/getUserById/getUserByIdErrors';
import { UserMap } from '../../mappers/userMap';

import TYPES from '../../../../../shared/infra/constants/types';

@controller('/api/v1/users/me')
export class GetCurrentUserController extends BaseController {
  constructor(@inject(TYPES.GetUserById) private useCase: GetUserById) {
    super();
  }

  @httpGet('/', isAuthenticated)
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { userId } = req['context'];
    try {
      const result = await this.useCase.execute({ userId });

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case GetUserByIdErrors.UserNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const user = result.value.getValue();
        return this.ok(res, {
          user: UserMap.toDTO(user),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
