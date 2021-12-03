import { InterviewId } from './../interviewId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let interviewId: InterviewId;
let interviewIdOrError: Result<InterviewId>;

test('Should be able to create a interviewId', () => {
  interviewIdOrError = InterviewId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(interviewIdOrError.isSuccess).toBe(true);
  interviewId = interviewIdOrError.getValue();
  expect(interviewId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
