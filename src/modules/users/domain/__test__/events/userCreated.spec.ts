import { User } from '../../user';
import { UserEmail } from '../../userEmail';
import { UserCreated } from '../../events/userCreated';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

test('Should be able to create a UserCreated Event', () => {
  const id: UniqueEntityID = new UniqueEntityID('210e5965-5902-40c4-8f89-e9c2fa412550');
  const user: User = User.create(
    {
      firstName: 'Jordy',
      lastName: 'Morales',
      email: UserEmail.create('jordy.morales@nearshorecode.com').getValue(),
    },
    id,
  ).getValue();
  const userCreated: UserCreated = new UserCreated(user);
  expect(userCreated.getAggregateId()).toBe(id);
});
