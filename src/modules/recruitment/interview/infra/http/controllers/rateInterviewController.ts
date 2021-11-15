import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { RateInterview } from '../../../useCases/rateInterview/rateInterview';
import { RateInterviewErrors } from '../../../useCases/rateInterview/rateInterviewErrors';
import { RateInterviewRequestDTO } from '../../../useCases/rateInterview/rateInterviewRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';

import TYPES from '../../../../../../shared/infra/constants/types';
import { RateMap } from '../../mappers/rateMap';

@controller('/api/v1/interviews/:id/rates')
export class RateInterviewController extends BaseController {
  constructor(@inject(TYPES.RateInterview) private useCase: RateInterview) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: RateInterviewRequestDTO = req.body as RateInterviewRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, interviewId: id, ratedBy: req['context'] });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case RateInterviewErrors.InterviewNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const rateCreated = result.value.getValue();
        return this.created(res, {
          rate: RateMap.toDTO(rateCreated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
