import { injectable, inject } from 'inversify';
import { Process } from '../../domain/process';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UseCase } from '../../../../../shared/core/UseCase';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<AppError.UnexpectedError, Result<Process[]>>;

@injectable()
export class GetAllProcesses implements UseCase<GetAllProcesses, Promise<Response>> {
  constructor(@inject(TYPES.IProcessRepo) private processRepo: IProcessRepo) {}

  public async execute(): Promise<Response> {
    try {
      const processes = await this.processRepo.getAllProcesses();
      return right(Result.ok<Process[]>(processes));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
