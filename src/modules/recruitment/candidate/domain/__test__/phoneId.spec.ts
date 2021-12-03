import { PhoneId } from './../phoneId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let phoneId: PhoneId;
let phoneIdOrError: Result<PhoneId>;

test('Should be able to create a phoneId', () => {
  phoneIdOrError = PhoneId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(phoneIdOrError.isSuccess).toBe(true);
  phoneId = phoneIdOrError.getValue();
  expect(phoneId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
