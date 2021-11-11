import { injectable, inject } from 'inversify';
import { Tag } from '../../domain/tag';
import { CreateTagErrors } from './createTagErrors';
import { CreateTagRequestDTO } from './createTagRequestDTO';
import { ITagRepo } from '../../domain/ports/ITagRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

type Response = Either<
  CreateTagErrors.TagAlreadyExistsError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class CreateTag implements UseCase<CreateTagRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.ITagRepo) private tagRepo: ITagRepo) {}

  public async execute(request?: CreateTagRequestDTO): Promise<Response> {
    try {
      const tagAlreadyExists = await this.tagRepo.exists(request.name);
      if (tagAlreadyExists) {
        return left(new CreateTagErrors.TagAlreadyExistsError(request.name)) as Response;
      }

      const tagOrError = Tag.create(request);

      if (tagOrError.isFailure) {
        return left(tagOrError);
      }

      const tag = tagOrError.getValue();

      await this.tagRepo.save(tag);

      return right(Result.ok<void>());
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
