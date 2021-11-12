import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { StepMap } from '../../mappers/stepMap';
import { GetAllProcessesSteps } from '../../../useCases/getAllProcessesSteps/getAllProcessesSteps';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetAllProcessesStepsErrors } from '../../../useCases/getAllProcessesSteps/getAllProcessesStepsErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/processes/:id/steps')
export class GetAllProcessesStepsController extends BaseController {
  constructor(@inject(TYPES.GetAllProcessesSteps) private useCase: GetAllProcessesSteps) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ processId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case GetAllProcessesStepsErrors.ProcessNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const steps = result.value.getValue();
        return this.ok(res, {
          steps: steps.map((step) => StepMap.toDTO(step)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
