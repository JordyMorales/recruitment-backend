import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { CreateUser } from '../../../useCases/createUser/createUser';
import { CreateUserErrors } from '../../../useCases/createUser/createUserErrors';
import { CreateUserRequestDTO } from '../../../useCases/createUser/createUserRequestDTO';
import { BaseController } from '../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../shared/infra/constants/types';

@controller('/api/v1/users')
export class CreateUserController extends BaseController {
  constructor(@inject(TYPES.CreateUser) private useCase: CreateUser) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateUserRequestDTO = req.body as CreateUserRequestDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.EmailAlreadyExistsError:
            return this.conflict(res, error.errorValue().message);
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
