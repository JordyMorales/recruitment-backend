import { injectable, inject } from 'inversify';
import { TagId } from '../../domain/tagId';
import { Tag, TagProps } from '../../domain/tag';
import { ITagRepo } from '../../domain/ports/ITagRepo';
import { UpdateTagErrors } from './updateTagError';
import { UpdateTagRequestDTO } from './updateTagRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  UpdateTagErrors.TagNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class UpdateTag implements UseCase<UpdateTagRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.ITagRepo) private tagRepo: ITagRepo) {}

  public async execute(request: UpdateTagRequestDTO): Promise<Response> {
    try {
      let tagFound: Tag;

      try {
        const tagId = TagId.create(new UniqueEntityID(request.tagId)).getValue();
        tagFound = await this.tagRepo.getTagById(tagId);
      } catch (error) {
        return left(new UpdateTagErrors.TagNotFoundError(request.tagId));
      }

      const tagProps: TagProps = {
        ...tagFound.props,
        ...request,
      };

      const tagOrError = Tag.create(tagProps, tagFound.id);

      if (tagOrError.isFailure) {
        return left(Result.fail<any>(tagOrError.error.toString())) as Response;
      }

      const tag: Tag = tagOrError.getValue();

      await this.tagRepo.update(tag);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
