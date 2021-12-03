import { TechnologyId } from './../technologyId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let technologyId: TechnologyId;
let technologyIdOrError: Result<TechnologyId>;

test('Should be able to create a technologyId', () => {
  technologyIdOrError = TechnologyId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(technologyIdOrError.isSuccess).toBe(true);
  technologyId = technologyIdOrError.getValue();
  expect(technologyId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
