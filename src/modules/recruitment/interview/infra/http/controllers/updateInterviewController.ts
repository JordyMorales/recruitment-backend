import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateInterview } from '../../../useCases/updateInterview/updateInterview';
import { UpdateInterviewErrors } from '../../../useCases/updateInterview/updateInterviewError';
import { UpdateInterviewRequestDTO } from '../../../useCases/updateInterview/updateInterviewRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/interviews/:id')
export class UpdateInterviewController extends BaseController {
  constructor(@inject(TYPES.UpdateInterview) private useCase: UpdateInterview) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateInterviewRequestDTO = req.body as UpdateInterviewRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, interviewId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateInterviewErrors.InterviewNotFoundError:
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
