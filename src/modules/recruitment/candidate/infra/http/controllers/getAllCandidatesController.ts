import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { CandidateMap } from '../../mappers/candidateMap';
import { GetAllCandidates } from '../../../useCases/getAllCandidates/getAllCandidates';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/candidates')
export class GetAllCandidatesController extends BaseController {
  constructor(@inject(TYPES.GetAllCandidates) private useCase: GetAllCandidates) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        return this.fail(res, result.value.errorValue().message);
      } else {
        const candidates = result.value.getValue();
        return this.ok(res, {
          candidates: candidates.map((candidate) => CandidateMap.toDTO(candidate)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
