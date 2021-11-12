import { injectable, inject } from 'inversify';
import { Step, StepProps } from '../../domain/step';
import { ProcessId } from '../../domain/processId';
import { IStepRepo } from '../../domain/ports/IStepRepo';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { AddStepToProcessErrors } from './addStepToProcessErrors';
import { AddStepToProcessRequestDTO } from './addStepToProcessRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';

type Response = Either<AddStepToProcessErrors.ProcessDoesNotExists | AppError.UnexpectedError, Result<Step>>;

@injectable()
export class AddStepToProcess implements UseCase<AddStepToProcessRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IStepRepo) private stepRepo: IStepRepo,
    @inject(TYPES.IProcessRepo) private processRepo: IProcessRepo,
  ) {}

  public async execute(request?: AddStepToProcessRequestDTO): Promise<Response> {
    try {
      const processId = ProcessId.create(new UniqueEntityID(request.processId)).getValue();
      const processFound = await this.processRepo.getProcessById(processId);
      const exists = !!processFound === true;

      if (!exists) {
        return left(new AddStepToProcessErrors.ProcessDoesNotExists(request.processId)) as Response;
      }

      const stepProps: StepProps = {
        ...request,
        processId,
      };

      const stepOrError = Step.create(stepProps);

      if (stepOrError.isFailure) {
        return left(Result.fail(stepOrError.error.toString()));
      }

      const step = stepOrError.getValue();

      await this.stepRepo.save(step);

      return right(Result.ok<Step>(step));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
