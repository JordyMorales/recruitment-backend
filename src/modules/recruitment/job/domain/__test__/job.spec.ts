import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { User } from '../../../../users/domain/user';
import { UserEmail } from '../../../../users/domain/userEmail';
import { Job } from '../job';
import { ProcessId } from '../processId';

let job: Job;
let jobOrError: Result<Job>;
let userOrError: Result<User>;

test('Should be able to create a job', () => {
  userOrError = User.create(
    {
      firstName: 'Jordy',
      lastName: 'Morales',
      email: UserEmail.create('jordy.morales@nearshorecode.com').getValue(),
    },
    new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6'),
  );

  jobOrError = Job.create({
    name: 'React engineer',
    processId: ProcessId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
    createdBy: userOrError.getValue(),
  });
  expect(jobOrError.isSuccess).toBe(true);
  job = jobOrError.getValue();
  expect(job.name).toContain('React engineer');
  expect(job.description).toBeNull();
  expect(job.state).toBe('DRAFF');
});
