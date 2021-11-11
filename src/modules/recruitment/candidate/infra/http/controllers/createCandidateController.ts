import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { CreateCandidate } from '../../../useCases/createCandidate/createCandidate';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { CreateCandidateErrors } from '../../../useCases/createCandidate/createCandidateErrors';
import { CreateCandidateRequestDTO } from '../../../useCases/createCandidate/createCandidateRequestDTO';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { CandidateMap } from '../../mappers/candidateMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/candidates')
export class CreateCandidateController extends BaseController {
  constructor(@inject(TYPES.CreateCandidate) private useCase: CreateCandidate) {
    super();
  }

  @httpPost('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateCandidateRequestDTO = req.body as CreateCandidateRequestDTO;
    try {
      const result = await this.useCase.execute({ ...dto, createdBy: req['context'].userId });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case CreateCandidateErrors.UserNotFoundError:
            return this.notFound(res, error.errorValue().message);
          case CreateCandidateErrors.CandidateAlreadyExistsError:
          case CreateCandidateErrors.EmailAlreadyExistsError:
          case CreateCandidateErrors.PhoneAlreadyExistsError:
            return this.conflict(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const candidateCreated = result.value.getValue();
        return this.created(res, {
          candidate: CandidateMap.toDTO(candidateCreated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
