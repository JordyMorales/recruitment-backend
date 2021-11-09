import { User } from '../user';
import { UserEmail } from '../userEmail';
import { Result } from '../../../../shared/core/Result';

let user: User;
let userOrError: Result<User>;

test('Should be able to create a user', () => {
  userOrError = User.create({
    firstName: 'Jordy',
    lastName: 'Morales',
    email: UserEmail.create('jordy.morales@nearshorecode.com').getValue(),
  });
  expect(userOrError.isSuccess).toBe(true);
  user = userOrError.getValue();

  expect(user.firstName).toBe('Jordy');
  expect(user.middleName).toBeNull();
  expect(user.lastName).toBe('Morales');
  expect(user.email.value).toBe('jordy.morales@nearshorecode.com');
  expect(user.password).toBeNull();
  expect(user.phone).toBeNull();
  expect(user.dateOfBirth).toBeNull();
  expect(user.country).toBeNull();
  expect(user.city).toBeNull();
  expect(user.address).toBeNull();
  expect(user.photoUrl).toBeNull();
  expect(user.resumeUrl).toBeNull();
  expect(user.jobTitle).toBeNull();
  expect(user.role).toBe('CANDIDATE');
  expect(user.state).toBe('ACTIVE');
});
