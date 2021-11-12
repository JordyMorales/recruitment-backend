import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { JobMap } from '../../mappers/jobMap';
import { GetJobById } from '../../../useCases/getJobById/getJobById';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetJobByIdErrors } from '../../../useCases/getJobById/getJobByIdErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/jobs/:id')
export class GetJobByIdController extends BaseController {
  constructor(@inject(TYPES.GetJobById) private useCase: GetJobById) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ jobId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case GetJobByIdErrors.JobNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const job = result.value.getValue();
        return this.ok(res, {
          job: JobMap.toDTO(job),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
