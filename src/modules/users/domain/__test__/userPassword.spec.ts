import { UserPassword } from '../userPassword';
import { Result } from '../../../../shared/core/Result';
import { TextUtils } from './../../../../shared/utils/TextUtils';

let userPasswordOrError: Result<UserPassword>;

test('Should be able to create a user password', () => {
  const randomPassword = TextUtils.generatePassword();
  userPasswordOrError = UserPassword.create(randomPassword);
  expect(userPasswordOrError.isSuccess).toBe(true);
});

test('Should fail when the password does not meet the criteria of at least 6 characters.', () => {
  userPasswordOrError = UserPassword.create('Nears');
  expect(userPasswordOrError.isFailure).toBe(true);
  expect(userPasswordOrError.error).toBe("Password doesn't meet criteria [6 chars min].");
});

test('Should fail when the password does not meet the criteria of at least 1 digit.', () => {
  userPasswordOrError = UserPassword.create('Nearshore');
  expect(userPasswordOrError.isFailure).toBe(true);
  expect(userPasswordOrError.error).toBe("Password doesn't meet criteria [1 digit min].");
});

test('Should fail when the password does not meet the criteria of at least 1 lowercase.', () => {
  userPasswordOrError = UserPassword.create('NEARSHORE1');
  expect(userPasswordOrError.isFailure).toBe(true);
  expect(userPasswordOrError.error).toBe("Password doesn't meet criteria [1 lowercase letter min].");
});

test('Should fail when the password does not meet the criteria of at least 1 uppercase.', () => {
  userPasswordOrError = UserPassword.create('nearshore1');
  expect(userPasswordOrError.isFailure).toBe(true);
  expect(userPasswordOrError.error).toBe("Password doesn't meet criteria [1 uppercase letter min].");
});

test("It should fail when the password doesn't meet criteria 1 non-alphanumeric character min.", () => {
  userPasswordOrError = UserPassword.create('Nearshore1');
  expect(userPasswordOrError.isFailure).toBe(true);
  expect(userPasswordOrError.error).toBe(
    "Password doesn't meet criteria [1 non-alphanumeric character min].",
  );
});
