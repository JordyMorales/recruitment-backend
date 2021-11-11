import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { CandidateMap } from '../../mappers/candidateMap';
import { GetCandidateById } from '../../../useCases/getCandidateById/GetCandidateById';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetCandidateByIdErrors } from '../../../useCases/getCandidateById/GetCandidateByIdErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/candidates/:id')
export class GetCandidateByIdController extends BaseController {
  constructor(@inject(TYPES.GetCandidateById) private useCase: GetCandidateById) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'], allowSame: true }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ candidateId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case GetCandidateByIdErrors.CandidateNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const candidate = result.value.getValue();
        return this.ok(res, {
          candidate: CandidateMap.toDTO(candidate),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
