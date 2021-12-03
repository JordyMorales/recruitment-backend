import { StepId } from './../stepId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let stepId: StepId;
let stepIdOrError: Result<StepId>;

test('Should be able to create a stepId', () => {
  stepIdOrError = StepId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(stepIdOrError.isSuccess).toBe(true);
  stepId = stepIdOrError.getValue();
  expect(stepId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
