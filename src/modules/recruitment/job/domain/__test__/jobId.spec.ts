import { JobId } from './../jobId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let jobId: JobId;
let jobIdOrError: Result<JobId>;

test('Should be able to create a jobId', () => {
  jobIdOrError = JobId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(jobIdOrError.isSuccess).toBe(true);
  jobId = jobIdOrError.getValue();
  expect(jobId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
