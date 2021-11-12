import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateJob } from '../../../useCases/updateJob/updateJob';
import { UpdateJobErrors } from '../../../useCases/updateJob/updateJobError';
import { UpdateJobRequestDTO } from '../../../useCases/updateJob/updateJobRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/jobs/:id')
export class UpdateJobController extends BaseController {
  constructor(@inject(TYPES.UpdateJob) private useCase: UpdateJob) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateJobRequestDTO = req.body as UpdateJobRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, jobId: id, updatedBy: req['context'] });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateJobErrors.ProcessNotFoundError:
          case UpdateJobErrors.JobNotFoundError:
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
