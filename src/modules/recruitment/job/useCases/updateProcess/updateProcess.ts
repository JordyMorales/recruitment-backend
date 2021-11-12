import { injectable, inject } from 'inversify';
import { ProcessId } from '../../domain/processId';
import { Process, ProcessProps } from '../../domain/process';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { UpdateProcessErrors } from './updateProcessError';
import { UpdateProcessRequestDTO } from './updateProcessRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  UpdateProcessErrors.ProcessNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class UpdateProcess implements UseCase<UpdateProcessRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.IProcessRepo) private processRepo: IProcessRepo) {}

  public async execute(request: UpdateProcessRequestDTO): Promise<Response> {
    try {
      let processFound: Process;

      try {
        const processId = ProcessId.create(new UniqueEntityID(request.processId)).getValue();
        processFound = await this.processRepo.getProcessById(processId);
      } catch (error) {
        return left(new UpdateProcessErrors.ProcessNotFoundError(request.processId));
      }

      const processProps: ProcessProps = {
        ...processFound.props,
        ...request,
      };

      const processOrError = Process.create(processProps, processFound.id);

      if (processOrError.isFailure) {
        return left(Result.fail<any>(processOrError.error.toString())) as Response;
      }

      const process: Process = processOrError.getValue();

      await this.processRepo.update(process);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
