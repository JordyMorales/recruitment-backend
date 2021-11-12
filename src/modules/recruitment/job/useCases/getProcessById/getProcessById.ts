import { injectable, inject } from 'inversify';
import { Process } from '../../domain/process';
import { ProcessId } from '../../domain/processId';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { GetProcessByIdErrors } from './getProcessByIdErrors';
import { GetProcessByIdRequestDTO } from './getProcessByIdRequestDTO';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  GetProcessByIdErrors.ProcessNotFoundError | AppError.UnexpectedError,
  Result<Process>
>;

@injectable()
export class GetProcessById implements UseCase<GetProcessByIdRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.IProcessRepo) private processRepo: IProcessRepo) {}

  public async execute(request: GetProcessByIdRequestDTO): Promise<Response> {
    try {
      const processId = ProcessId.create(new UniqueEntityID(request.processId)).getValue();
      const processFound = await this.processRepo.getProcessById(processId);
      const exists = !!processFound === true;

      if (!exists) {
        return left(new GetProcessByIdErrors.ProcessNotFoundError(request.processId)) as Response;
      }

      return right(Result.ok<Process>(processFound));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
