import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { GetAllJobs } from '../../../useCases/getAllJobs/getAllJobs';
import { isAuthenticated } from '../../../../../../shared/infra/http/middlewares';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { JobMap } from '../../mappers/jobMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/jobs')
export class GetAllJobsController extends BaseController {
  constructor(@inject(TYPES.GetAllJobs) private useCase: GetAllJobs) {
    super();
  }

  @httpGet('/', isAuthenticated)
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message);
      } else {
        const jobs = result.value.getValue();
        return this.ok(res, {
          jobs: jobs.map((job) => JobMap.toDTO(job)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
