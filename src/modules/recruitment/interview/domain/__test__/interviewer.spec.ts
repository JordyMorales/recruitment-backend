import { Interviewer } from './../interviewer';
import { InterviewId } from './../interviewId';
import { UserId } from '../../../../users/domain/userId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Result } from '../../../../../shared/core/Result';

let interviewer: Interviewer;
let interviewerOrError: Result<Interviewer>;

test('Should be able to create a comment', () => {
  interviewerOrError = Interviewer.create({
    userId: UserId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb')).getValue(),
    interviewId: InterviewId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
  });
  expect(interviewerOrError.isSuccess).toBe(true);
  interviewer = interviewerOrError.getValue();
  expect(interviewer.userId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
  expect(interviewer.interviewId.id.toString()).toBe('3700fbfb-12bb-475a-88a3-393cf16ab9d6');
});
