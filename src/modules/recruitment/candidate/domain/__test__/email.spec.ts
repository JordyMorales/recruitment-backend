import { Email } from './../email';
import { CandidateId } from './../candidateId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Result } from '../../../../../shared/core/Result';

let email: Email;
let emailOrError: Result<Email>;
let candidateId: CandidateId = CandidateId.create(
  new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6'),
).getValue();

test('Should be able to create a email', () => {
  emailOrError = Email.create({ value: 'jordy.morales@nearshorecode.com', candidateId });
  expect(emailOrError.isSuccess).toBe(true);
  email = emailOrError.getValue();
  expect(email.value).toBe('jordy.morales@nearshorecode.com');
});

test('Should fail when email is invalid', () => {
  emailOrError = Email.create({ value: 'jordy.morales@nearshorecode', candidateId });
  expect(emailOrError.isFailure).toBe(true);
  expect(emailOrError.error).toBe("The email 'jordy.morales@nearshorecode' is not valid");
});
