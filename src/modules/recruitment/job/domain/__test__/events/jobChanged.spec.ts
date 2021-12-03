import { JobChanged } from './../../events/jobChanged';
import { Job } from '../../job';
import { ProcessId } from '../../processId';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { Result } from '../../../../../../shared/core/Result';
import { User } from '../../../../../users/domain/user';
import { UserEmail } from '../../../../../users/domain/userEmail';

let jobOrError: Result<Job>;
let userOrError: Result<User>;

test('Should be able to create a JobChanged Event', () => {
  const id: UniqueEntityID = new UniqueEntityID('210e5965-5902-40c4-8f89-e9c2fa412550');
  userOrError = User.create(
    {
      firstName: 'Jordy',
      lastName: 'Morales',
      email: UserEmail.create('jordy.morales@nearshorecode.com').getValue(),
    },
    new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6'),
  );

  jobOrError = Job.create(
    {
      name: 'React engineer',
      processId: ProcessId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
      createdBy: userOrError.getValue(),
    },
    id,
  );
  const jobChanged: JobChanged = new JobChanged(jobOrError.getValue());
  expect(jobChanged.getAggregateId()).toBe(id);
});
