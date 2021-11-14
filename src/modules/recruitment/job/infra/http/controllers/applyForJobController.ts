import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated } from '../../../../../../shared/infra/http/middlewares';
import { ApplyForJobRequestDTO } from '../../../useCases/applyForJob/applyForJobRequestDTO';
import { ApplyForJob } from '../../../useCases/applyForJob/applyForJob';
import { ApplyForJobErrors } from '../../../useCases/applyForJob/applyForJobErrors';
import { ApplicationMap } from '../../mappers/applicationMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/jobs/applications')
export class ApplyForJobController extends BaseController {
  constructor(@inject(TYPES.ApplyForJob) private useCase: ApplyForJob) {
    super();
  }

  @httpPost('/', isAuthenticated)
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: ApplyForJobRequestDTO = req.body as ApplyForJobRequestDTO;
    try {
      const result = await this.useCase.execute({ ...dto });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case ApplyForJobErrors.JobDoesNotExists:
          case ApplyForJobErrors.CandidateDoesNotExists:
          case ApplyForJobErrors.StepDoesNotExists:
            return this.notFound(res, error.errorValue().message);
          case ApplyForJobErrors.ApplicationAlreadyExistsError:
            return this.conflict(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const applicationCreated = result.value.getValue();
        return this.created(res, {
          application: ApplicationMap.toDTO(applicationCreated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
