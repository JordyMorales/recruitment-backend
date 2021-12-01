import { injectable, inject } from 'inversify';
import { Application } from '../../domain/application';
import { ApplicationId } from '../../domain/applicationId';
import { IApplicationRepo } from '../../domain/ports/IApplicationRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { GetApplicationByIdErrors } from './getApplicationByIdErrors';
import { GetApplicationByIdRequestDTO } from './getApplicationByIdRequestDTO';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<GetApplicationByIdErrors.ApplicationNotFoundError | AppError.UnexpectedError, Result<Application>>;

@injectable()
export class GetApplicationById implements UseCase<GetApplicationByIdRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.IApplicationRepo) private applicationRepo: IApplicationRepo) {}

  public async execute(request: GetApplicationByIdRequestDTO): Promise<Response> {
    try {
      const applicationId = ApplicationId.create(new UniqueEntityID(request.applicationId)).getValue();
      const applicationFound = await this.applicationRepo.getApplicationById(applicationId);
      const exists = !!applicationFound === true;

      if (!exists) {
        return left(new GetApplicationByIdErrors.ApplicationNotFoundError(request.applicationId)) as Response;
      }

      return right(Result.ok<Application>(applicationFound));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
