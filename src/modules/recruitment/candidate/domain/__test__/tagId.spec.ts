import { TagId } from './../tagId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let tagId: TagId;
let tagIdOrError: Result<TagId>;

test('Should be able to create a tagId', () => {
  tagIdOrError = TagId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(tagIdOrError.isSuccess).toBe(true);
  tagId = tagIdOrError.getValue();
  expect(tagId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
