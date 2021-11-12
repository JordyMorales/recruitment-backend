import express from 'express';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { CreateComment } from '../../../useCases/createComment/createComment';
import { BaseController } from '../../../../../../shared/infra/http/models/BaseController';
import { isAuthenticated, isAuthorized } from '../../../../../../shared/infra/http/middlewares';
import { CreateCommentRequestDTO } from '../../../useCases/createComment/createCommentRequestDTO';
import { CreateCommentErrors } from '../../../useCases/createComment/createCommentErrors';
import { CommentMap } from '../../mappers/commentMap';
import TYPES from '../../../../../../shared/infra/constants/types';

@controller('/api/v1/candidates/comments')
export class CreateCommentController extends BaseController {
  constructor(@inject(TYPES.CreateComment) private useCase: CreateComment) {
    super();
  }

  @httpPost(
    '/',
    isAuthenticated,
    isAuthorized({ hasRole: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE'] }),
  )
  async executeImpl(req: express.Request, res: express.Response): Promise<any> {
    const dto: CreateCommentRequestDTO = req.body as CreateCommentRequestDTO;
    try {
      const result = await this.useCase.execute({ ...dto, commentedBy: req['context'] });

      if (result.isLeft()) {
        const error = result.value;
        switch (error.constructor) {
          case CreateCommentErrors.CandidateNotFoundError:
            return this.notFound(res, error.errorValue().message);
          default:
            return this.fail(res, error.errorValue()?.message ?? error.errorValue());
        }
      } else {
        const commentCreated = result.value.getValue();
        return this.created(res, {
          comment: CommentMap.toDTO(commentCreated),
        });
      }
    } catch (err) {
      return this.fail(res, err);
    }
  }
}
