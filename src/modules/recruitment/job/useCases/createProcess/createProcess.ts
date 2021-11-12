import { injectable, inject } from 'inversify';
import { Process } from '../../domain/process';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { CreateProcessErrors } from './createProcessErrors';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { CreateProcessRequestDTO } from './createProcessRequestDTO';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

type Response = Either<
  CreateProcessErrors.ProcessAlreadyExistsError | AppError.UnexpectedError,
  Result<Process>
>;

@injectable()
export class CreateProcess implements UseCase<CreateProcessRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.IProcessRepo) private processRepo: IProcessRepo) {}

  public async execute(request?: CreateProcessRequestDTO): Promise<Response> {
    try {
      const processAlreadyExists = await this.processRepo.exists(request.code);
      if (processAlreadyExists) {
        return left(new CreateProcessErrors.ProcessAlreadyExistsError(request.code)) as Response;
      }

      const processOrError = Process.create(request);

      if (processOrError.isFailure) {
        return left(Result.fail(processOrError.error.toString()));
      }

      const process = processOrError.getValue();

      await this.processRepo.save(process);

      return right(Result.ok<Process>(process));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
