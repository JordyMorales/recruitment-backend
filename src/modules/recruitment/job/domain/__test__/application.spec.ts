import { JobId } from '../jobId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Application } from '../application';
import { Candidate } from '../../../candidate/domain/candidate';
import { Step } from '../step';

let application: Application;
let applicationOrError: Result<Application>;

test('Should be able to create a comment', () => {
  applicationOrError = Application.create({
    appliedAt: new Date(Date.now()),
    appliedBy: Candidate.create({}).getValue(),
    jobId: JobId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
    step: Step.create(
      { order: 0, name: 'test' },
      new UniqueEntityID('f00fe826-0b25-432e-9f49-086830cd65fb'),
    ).getValue(),
  });
  expect(applicationOrError.isSuccess).toBe(true);
  application = applicationOrError.getValue();
  expect(application.jobId.id.toString()).toBe('3700fbfb-12bb-475a-88a3-393cf16ab9d6');
  expect(application.step.stepId.id.toString()).toBe('f00fe826-0b25-432e-9f49-086830cd65fb');
});
