import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { RateMap } from '../../mappers/rateMap';
import { GetInterviewRatings } from '../../../useCases/getInterviewRatings/getInterviewRatings';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetInterviewRatingsErrors } from '../../../useCases/getInterviewRatings/getInterviewRatingsErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/interviews/:id/rates')
export class GetInterviewRatingsController extends BaseController {
  constructor(@inject(TYPES.GetInterviewRatings) private useCase: GetInterviewRatings) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ interviewId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case GetInterviewRatingsErrors.InterviewNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const rates = result.value.getValue();
        return this.ok(res, {
          rates: rates.map((rate) => RateMap.toDTO(rate)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
