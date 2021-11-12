import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { AddStepToProcessRequestDTO } from '../../../useCases/addStepToProcess/addStepToProcessRequestDTO';
import { AddStepToProcess } from '../../../useCases/addStepToProcess/addStepToProcess';
import { AddStepToProcessErrors } from '../../../useCases/addStepToProcess/addStepToProcessErrors';
import { StepMap } from '../../mappers/stepMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/steps')
export class AddStepToProcessController extends BaseController {
  constructor(@inject(TYPES.AddStepToProcess) private useCase: AddStepToProcess) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: AddStepToProcessRequestDTO = req.body as AddStepToProcessRequestDTO;
    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case AddStepToProcessErrors.ProcessDoesNotExists:
            return this.conflict(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const stepCreated = result.value.getValue();
        return this.created(res, {
          step: StepMap.toDTO(stepCreated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
