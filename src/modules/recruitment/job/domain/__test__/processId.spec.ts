import { ProcessId } from './../processId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let processId: ProcessId;
let processIdOrError: Result<ProcessId>;

test('Should be able to create a processId', () => {
  processIdOrError = ProcessId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(processIdOrError.isSuccess).toBe(true);
  processId = processIdOrError.getValue();
  expect(processId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
