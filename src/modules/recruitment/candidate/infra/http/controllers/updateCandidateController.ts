import express from 'express';
import { inject } from 'inversify';
import { controller, httpPut } from 'inversify-express-utils';
import { UpdateCandidate } from '../../../useCases/updateCandidate/updateCandidate';
import { UpdateCandidateErrors } from '../../../useCases/updateCandidate/updateCandidateError';
import { UpdateCandidateRequestDTO } from '../../../useCases/updateCandidate/updateCandidateRequestDTO';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { CandidateMap } from '../../mappers/candidateMap';

import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/candidates/:id')
export class UpdateCandidateController extends BaseController {
  constructor(@inject(TYPES.UpdateCandidate) private useCase: UpdateCandidate) {
    super();
  }

  @httpPut('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER'], allowSame: true }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: UpdateCandidateRequestDTO = req.body as UpdateCandidateRequestDTO;
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ ...dto, userId: id, updatedBy: req['context'] });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case UpdateCandidateErrors.CandidateNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const candidateUpdated = result.value.getValue();
        return this.created(res, {
          candidate: CandidateMap.toDTO(candidateUpdated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
