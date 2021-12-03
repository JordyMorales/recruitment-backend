import { Comment } from './../comment';
import { CandidateId } from '../candidateId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { User } from '../../../../users/domain/user';
import { UserEmail } from '../../../../users/domain/userEmail';

let comment: Comment;
let commentOrError: Result<Comment>;
let userOrError: Result<User>;

test('Should be able to create a comment', () => {
  userOrError = User.create(
    {
      firstName: 'Jordy',
      lastName: 'Morales',
      email: UserEmail.create('jordy.morales@nearshorecode.com').getValue(),
    },
    new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6'),
  );

  commentOrError = Comment.create({
    comment: 'comment',
    candidateId: CandidateId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb')).getValue(),
    commentedBy: userOrError.getValue(),
  });
  expect(commentOrError.isSuccess).toBe(true);
  comment = commentOrError.getValue();
  expect(comment.comment).toBe('comment');
  expect(comment.commentedBy.id.toString()).toBe('3700fbfb-12bb-475a-88a3-393cf16ab9d6');
  expect(comment.candidateId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
