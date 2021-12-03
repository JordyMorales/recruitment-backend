import { CommentChanged } from './../../events/commentChanged';
import { Comment } from './../../comment';
import { CandidateId } from './../../candidateId';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { Result } from '../../../../../../shared/core/Result';
import { User } from '../../../../../users/domain/user';
import { UserEmail } from '../../../../../users/domain/userEmail';

let userOrError: Result<User>;

test('Should be able to create a CommentChanged Event', () => {
  const id: UniqueEntityID = new UniqueEntityID('210e5965-5902-40c4-8f89-e9c2fa412550');

  userOrError = User.create({
    firstName: 'Jordy',
    lastName: 'Morales',
    email: UserEmail.create('jordy.morales@nearshorecode.com').getValue(),
  });

  const candidate: Comment = Comment.create(
    {
      comment: 'comment',
      commentedBy: userOrError.getValue(),
      candidateId: CandidateId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb')).getValue(),
    },
    id,
  ).getValue();
  const candidateChanged: CommentChanged = new CommentChanged(candidate);
  expect(candidateChanged.getAggregateId()).toBe(id);
});
