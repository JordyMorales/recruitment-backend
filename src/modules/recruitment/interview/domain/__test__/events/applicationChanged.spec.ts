import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { Candidate } from '../../../../candidate/domain/candidate';
import { Application } from '../../../../job/domain/application';
import { JobId } from '../../../../job/domain/jobId';
import { Step } from '../../../../job/domain/step';
import { ApplicationChanged } from '../../events/applicationChanged';

let application: Application;

test('Should be able to create a ApplicationChanged Event', () => {
  const id: UniqueEntityID = new UniqueEntityID('210e5965-5902-40c4-8f89-e9c2fa412550');
  application = Application.create(
    {
      appliedAt: new Date(Date.now()),
      appliedBy: Candidate.create({}).getValue(),
      jobId: JobId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
      step: Step.create({ order: 0, name: 'test' }).getValue(),
    },
    id,
  ).getValue();

  const applicationChanged: ApplicationChanged = new ApplicationChanged(application);
  expect(applicationChanged.getAggregateId()).toBe(id);
});
