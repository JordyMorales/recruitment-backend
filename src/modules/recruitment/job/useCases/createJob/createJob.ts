import { injectable, inject } from 'inversify';
import { Job, JobProps } from '../../domain/job';
import { ProcessId } from '../../domain/processId';
import { UserMap } from '../../../../users/infra/mappers/userMap';
import { CreateJobErrors } from './createJobErrors';
import { CreateJobRequestDTO } from './createJobRequestDTO';
import { IJobRepo } from '../../domain/ports/IJobRepo';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { AppError } from '../../../../../shared/core/AppError';
import { UseCase } from '../../../../../shared/core/UseCase';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import TYPES from '../../../../../shared/infra/constants/types';
import { Technology } from '../../../candidate/domain/technology';

type Response = Either<CreateJobErrors.ProcessNotFoundError | AppError.UnexpectedError, Result<Job>>;

@injectable()
export class CreateJob implements UseCase<CreateJobRequestDTO, Promise<Response>> {
  constructor(
    @inject(TYPES.IJobRepo) private jobRepo: IJobRepo,
    @inject(TYPES.IProcessRepo) private processRepo: IProcessRepo,
  ) {}

  private technologiesToDomain(technologies: any[]): Technology[] {
    return technologies.map(({ technologyId, name }) => {
      const technologyOrError: Result<Technology> = Technology.create({ name }, technologyId);
      if (technologyOrError.isSuccess) return technologyOrError.getValue();
    });
  }

  public async execute(request?: CreateJobRequestDTO): Promise<Response> {
    try {
      const processId = ProcessId.create(new UniqueEntityID(request.processId)).getValue();
      const processFound = await this.processRepo.getProcessById(processId);
      const exists = !!processFound === true;

      if (!exists) {
        return left(new CreateJobErrors.ProcessNotFoundError(request.processId)) as Response;
      }

      const jobProps: JobProps = {
        ...request,
        createdBy: UserMap.dtoToDomain(request.createdBy),
        technologies: request.technologies ? this.technologiesToDomain(request.technologies) : [],
        processId,
      };

      const jobOrError = Job.create(jobProps);

      if (jobOrError.isFailure) {
        return left(Result.fail(jobOrError.error.toString()));
      }

      const job = jobOrError.getValue();

      await this.jobRepo.save(job);

      return right(Result.ok<Job>(job));
    } catch (error: any) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
