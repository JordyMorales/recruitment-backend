import { StepId } from './../../../../job/domain/stepId';
import { InterviewCreated } from './../../events/interviewCreated';
import { Interview } from './../../interview';
import { Result } from '../../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { ApplicationId } from '../../../../job/domain/applicationId';

let interviewOrError: Result<Interview>;

test('Should be able to create a InterviewCreated Event', () => {
  const id: UniqueEntityID = new UniqueEntityID('210e5965-5902-40c4-8f89-e9c2fa412550');
  interviewOrError = Interview.create(
    {
      topic: 'topic',
      applicationId: ApplicationId.create(
        new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'),
      ).getValue(),
      duration: 30,
      scheduledAt: new Date(Date.now()),
      stepId: StepId.create(new UniqueEntityID('f00fe826-0b25-432e-9f49-086830cd65fb')).getValue(),
    },
    id,
  );

  const applicationCreated: InterviewCreated = new InterviewCreated(interviewOrError.getValue());
  expect(applicationCreated.getAggregateId()).toBe(id);
});
