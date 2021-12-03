import { CommentId } from './../commentId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let commentId: CommentId;
let commentIdOrError: Result<CommentId>;

test('Should be able to create a commentId', () => {
  commentIdOrError = CommentId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(commentIdOrError.isSuccess).toBe(true);
  commentId = commentIdOrError.getValue();
  expect(commentId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
