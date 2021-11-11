import { injectable, inject } from 'inversify';
import { Tag } from '../../domain/tag';
import { ITagRepo } from '../../domain/ports/ITagRepo';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<AppError.UnexpectedError, Result<Tag[]>>;

@injectable()
export class GetAllTags implements UseCase<GetAllTags, Promise<Response>> {
  constructor(@inject(TYPES.ITagRepo) private tagRepo: ITagRepo) {}

  public async execute(): Promise<Response> {
    let tags: Tag[];
    try {
      tags = await this.tagRepo.getAllTags();
      return right(Result.ok<Tag[]>(tags));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
