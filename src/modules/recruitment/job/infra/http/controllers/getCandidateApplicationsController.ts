import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { ApplicationMap } from '../../mappers/applicationMap';
import { GetCandidateApplications } from '../../../useCases/getCandidateApplications/getCandidateApplications';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetCandidateApplicationsErrors } from '../../../useCases/getCandidateApplications/getCandidateApplicationsErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/candidates/:id/applications')
export class GetCandidateApplicationsController extends BaseController {
  constructor(@inject(TYPES.GetCandidateApplications) private useCase: GetCandidateApplications) {
    super();
  }

  @httpGet(
    '/',
    isAuthenticated,
    isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE'], allowSame: true }),
  )
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ candidateId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case GetCandidateApplicationsErrors.CandidateNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const applications = result.value.getValue();
        return this.ok(res, {
          applications: applications.map((step) => ApplicationMap.toDTO(step)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
