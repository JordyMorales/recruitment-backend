import express from 'express';
import { inject } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import { CommentMap } from '../../mappers/commentMap';
import { GetCandidateComments } from '../../../useCases/getCandidateComments/getCandidateComments';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { GetCandidateCommentsErrors } from '../../../useCases/getCandidateComments/getCandidateCommentsErrors';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/candidates/:id/comments')
export class GetCandidateCommentsController extends BaseController {
  constructor(@inject(TYPES.GetCandidateComments) private useCase: GetCandidateComments) {
    super();
  }

  @httpGet('/', isAuthenticated, isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE'] }))
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const { id } = req.params;

    try {
      const result = await this.useCase.execute({ candidateId: id });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case GetCandidateCommentsErrors.CandidateNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const comments = result.value.getValue();
        return this.ok(res, {
          comments: comments.map((comments) => CommentMap.toDTO(comments)),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
