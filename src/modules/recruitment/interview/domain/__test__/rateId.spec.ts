import { RateId } from './../rateId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let rateId: RateId;
let rateIdOrError: Result<RateId>;

test('Should be able to create a rateId', () => {
  rateIdOrError = RateId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(rateIdOrError.isSuccess).toBe(true);
  rateId = rateIdOrError.getValue();
  expect(rateId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
