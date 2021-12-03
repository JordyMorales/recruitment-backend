import { EmailId } from './../emailId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let emailId: EmailId;
let emailIdOrError: Result<EmailId>;

test('Should be able to create a emailId', () => {
  emailIdOrError = EmailId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(emailIdOrError.isSuccess).toBe(true);
  emailId = emailIdOrError.getValue();
  expect(emailId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
