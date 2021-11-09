import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { GetAllUsers } from '../../../useCases/getAllUsers/getAllUsers';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../shared/infra/http/middlewares';
import { UserMap } from '../../mappers/userMap';

import TYPES from '../../../../../shared/infra/constants/types';

@controller('/api/v1/users')
export class GetAllUsersController extends BaseController {
  constructor(@inject(TYPES.GetAllUsers) private useCase: GetAllUsers) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message);
      } else {
        const users = result.value.getValue();
        return this.ok(res, {
          users: users.map((user) => UserMap.toDTO(user)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
