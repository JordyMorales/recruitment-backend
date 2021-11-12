import { injectable, inject } from 'inversify';
import { StepId } from '../../domain/stepId';
import { Step, StepProps } from '../../domain/step';
import { ProcessId } from '../../domain/processId';
import { IStepRepo } from '../../domain/ports/IStepRepo';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { UpdateStepErrors } from './updateStepError';
import { UpdateStepRequestDTO } from './updateStepRequestDTO';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  UpdateStepErrors.ProcessNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class UpdateStep implements UseCase<UpdateStepRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IStepRepo) private stepRepo: IStepRepo,
    @inject(TYPES.IProcessRepo) private processRepo: IProcessRepo,
  ) {}

  public async execute(request: UpdateStepRequestDTO): Promise<Response> {
    try {
      const processId = ProcessId.create(new UniqueEntityID(request.processId)).getValue();
      const processFound = await this.processRepo.getProcessById(processId);
      const exists = !!processFound === true;

      if (!exists) {
        return left(new UpdateStepErrors.ProcessNotFoundError(request.processId)) as Response;
      }

      let stepFound: Step;
      const stepId = StepId.create(new UniqueEntityID(request.stepId)).getValue();

      try {
        stepFound = await this.stepRepo.getStepById(stepId);
      } catch (error) {
        return left(new UpdateStepErrors.StepNotFoundError(request.stepId));
      }

      const stepProps: StepProps = {
        ...stepFound.props,
        ...request,
        processId,
      };

      const StepOrError = Step.create(stepProps, stepFound.id);

      if (StepOrError.isFailure) {
        return left(Result.fail<any>(StepOrError.error.toString())) as Response;
      }

      const step: Step = StepOrError.getValue();

      await this.stepRepo.update(step);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
