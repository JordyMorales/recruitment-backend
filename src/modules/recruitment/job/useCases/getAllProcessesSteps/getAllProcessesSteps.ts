import { injectable, inject } from 'inversify';
import { Step } from '../../domain/step';
import { ProcessId } from '../../domain/processId';
import { IStepRepo } from '../../domain/ports/IStepRepo';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { GetAllProcessesStepsErrors } from './getAllProcessesStepsErrors';
import { GetAllProcessesStepsRequestDTO } from './getAllProcessesStepsRequestDTO';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, left, Result, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  GetAllProcessesStepsErrors.ProcessNotFoundError | AppError.UnexpectedError,
  Result<Step[]>
>;

@injectable()
export class GetAllProcessesSteps implements UseCase<GetAllProcessesStepsRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IStepRepo) private stepRepo: IStepRepo,
    @inject(TYPES.IProcessRepo) private processRepo: IProcessRepo,
  ) {}

  public async execute(request: GetAllProcessesStepsRequestDTO): Promise<Response> {
    try {
      const processId = ProcessId.create(new UniqueEntityID(request.processId)).getValue();
      const processFound = await this.processRepo.getProcessById(processId);
      const exists = !!processFound === true;

      if (!exists) {
        return left(new GetAllProcessesStepsErrors.ProcessNotFoundError(request.processId)) as Response;
      }

      const steps = await this.stepRepo.getAllProcessesSteps(processId);

      return right(Result.ok<Step[]>(steps));
    } catch (err) {
      return left(new AppError.UnexpectedError(err));
    }
  }
}
