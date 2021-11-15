import { injectable, inject } from 'inversify';
import { Rate, RateProps } from '../../domain/rate';
import { IRateRepo } from '../../domain/ports/IRateRepo';
import { UpdateRateErrors } from './updateRateErrors';
import { UpdateRateRequestDTO } from './updateRateRequestDTO';
import { RateId } from '../../domain/rateId';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';

export type Response = Either<
  UpdateRateErrors.RateNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class UpdateRate implements UseCase<UpdateRateRequestDTO, Promise<Response>> {
  constructor(@inject(TYPES.IRateRepo) private rateRepo: IRateRepo) {}

  public async execute(request: UpdateRateRequestDTO): Promise<Response> {
    try {
      const rateId = RateId.create(new UniqueEntityID(request.rateId)).getValue();
      const rateFound = await this.rateRepo.getRateById(rateId);
      const rateExists = !!rateFound === true;

      if (!rateExists) {
        return left(new UpdateRateErrors.RateNotFoundError(request.rateId)) as Response;
      }

      const rateProps: RateProps = {
        ...rateFound.props,
        ...request,
        ratedBy: rateFound.ratedBy,
        interviewId: rateFound.interviewId,
      };

      const rateOrError = Rate.create(rateProps, rateFound.id);

      if (rateOrError.isFailure) {
        return left(Result.fail(rateOrError.error.toString()));
      }
      const rate: Rate = rateOrError.getValue();

      await this.rateRepo.update(rate);

      return right(Result.ok<void>());
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
