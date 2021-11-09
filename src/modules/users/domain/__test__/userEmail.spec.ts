import { UserEmail } from '../userEmail';
import { Result } from '../../../../shared/core/Result';

let userEmail: UserEmail;
let userEmailOrError: Result<UserEmail>;

test('Should be able to create a user email', () => {
  userEmailOrError = UserEmail.create('jordy.morales@nearshorecode.com');
  expect(userEmailOrError.isSuccess).toBe(true);
  userEmail = userEmailOrError.getValue();
  expect(userEmail.value).toBe('jordy.morales@nearshorecode.com');
});

test('Should fail when email is invalid', () => {
  userEmailOrError = UserEmail.create('jordy.morales@nearshorecode');
  expect(userEmailOrError.isFailure).toBe(true);
  expect(userEmailOrError.error).toBe('Email address not valid');
});
