import { StepId } from './../../../job/domain/stepId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Result } from '../../../../../shared/core/Result';
import { Interview } from '../interview';
import { ApplicationId } from '../../../job/domain/applicationId';

let application: Interview;
let interviewOrError: Result<Interview>;

test('Should be able to create a comment', () => {
  interviewOrError = Interview.create({
    topic: 'topic',
    applicationId: ApplicationId.create(
      new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'),
    ).getValue(),
    duration: 30,
    scheduledAt: new Date(Date.now()),
    stepId: StepId.create(new UniqueEntityID('f00fe826-0b25-432e-9f49-086830cd65fb')).getValue(),
  });
  expect(interviewOrError.isSuccess).toBe(true);
  application = interviewOrError.getValue();
  expect(application.topic).toBe('topic');
  expect(application.applicationId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
