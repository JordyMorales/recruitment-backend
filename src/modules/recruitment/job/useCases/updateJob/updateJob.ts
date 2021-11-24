import { injectable, inject } from 'inversify';
import { JobId } from '../../domain/jobId';
import { ProcessId } from '../../domain/processId';
import { Job, JobProps } from '../../domain/job';
import { IJobRepo } from '../../domain/ports/IJobRepo';
import { UpdateJobErrors } from './updateJobError';
import { UpdateJobRequestDTO } from './updateJobRequestDTO';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { UserMap } from '../../../../users/infra/mappers/userMap';
import { UseCase } from '../../../../../shared/core/UseCase';
import { AppError } from '../../../../../shared/core/AppError';
import { Either, Result, left, right } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import TYPES from '../../../../../shared/infra/constants/types';
import { Technology } from '../../../candidate/domain/technology';

export type Response = Either<
  UpdateJobErrors.JobNotFoundError | AppError.UnexpectedError | Result<any>,
  Result<void>
>;

@injectable()
export class UpdateJob implements UseCase<UpdateJobRequestDTO, Promise<Response>> {
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

  public async execute(request: UpdateJobRequestDTO): Promise<Response> {
    try {
      const jobId = JobId.create(new UniqueEntityID(request.jobId)).getValue();
      const jobFound = await this.jobRepo.getJobById(jobId);
      const jobExists = !!jobFound === true;

      if (!jobExists) {
        return left(new UpdateJobErrors.JobNotFoundError(request.jobId)) as Response;
      }

      const processId = ProcessId.create(new UniqueEntityID(request.processId)).getValue();
      const processFound = await this.processRepo.getProcessById(processId);
      const processExists = !!processFound === true;

      if (!processExists) {
        return left(new UpdateJobErrors.JobNotFoundError(request.jobId)) as Response;
      }

      const jobProps: JobProps = {
        ...jobFound.props,
        ...request,
        processId,
        technologies: request.technologies ? this.technologiesToDomain(request.technologies) : [],
        createdBy: jobFound.createdBy,
        updatedBy: UserMap.dtoToDomain(request.updatedBy),
      };

      const jobOrError = Job.create(jobProps, jobFound.id);

      if (jobOrError.isFailure) {
        return left(Result.fail<any>(jobOrError.error.toString())) as Response;
      }

      const job: Job = jobOrError.getValue();

      await this.jobRepo.update(job);

      return right(Result.ok<void>());
    } catch (error) {
      return left(new AppError.UnexpectedError(error));
    }
  }
}
