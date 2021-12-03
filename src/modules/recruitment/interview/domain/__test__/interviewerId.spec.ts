import { InterviewerId } from './../interviewerId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let interviewerId: InterviewerId;
let interviewerIdOrError: Result<InterviewerId>;

test('Should be able to create a interviewerId', () => {
  interviewerIdOrError = InterviewerId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(interviewerIdOrError.isSuccess).toBe(true);
  interviewerId = interviewerIdOrError.getValue();
  expect(interviewerId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
