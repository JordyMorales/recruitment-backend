import { UserId } from '../userId';
import { Result } from '../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

let userId: UserId;
let userIdOrError: Result<UserId>;

test('Should be able to create a userId', () => {
  userIdOrError = UserId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(userIdOrError.isSuccess).toBe(true);
  userId = userIdOrError.getValue();
  expect(userId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
