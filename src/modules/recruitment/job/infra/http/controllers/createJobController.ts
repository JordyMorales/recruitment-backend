import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { CreateJobRequestDTO } from '../../../useCases/createJob/createJobRequestDTO';
import { CreateJob } from '../../../useCases/createJob/createJob';
import { CreateJobErrors } from '../../../useCases/createJob/createJobErrors';
import { JobMap } from '../../mappers/jobMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/jobs')
export class CreateJobController extends BaseController {
  constructor(@inject(TYPES.CreateJob) private useCase: CreateJob) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateJobRequestDTO = req.body as CreateJobRequestDTO;
    try {
      const result = await this.useCase.execute({ ...dto, createdBy: req['context'] });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case CreateJobErrors.ProcessNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const jobCreated = result.value.getValue();
        return this.created(res, {
          job: JobMap.toDTO(jobCreated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
