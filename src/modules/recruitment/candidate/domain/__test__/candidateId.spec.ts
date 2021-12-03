import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { CandidateId } from './../candidateId';

let candidateId: CandidateId;
let candidateIdOrError: Result<CandidateId>;

test('Should be able to create a candidateId', () => {
  candidateIdOrError = CandidateId.create(new UniqueEntityID('6b1bccdb-77d4-4f1b-b418-0b012ea079eb'));
  expect(candidateIdOrError.isSuccess).toBe(true);
  candidateId = candidateIdOrError.getValue();
  expect(candidateId.id.toString()).toBe('6b1bccdb-77d4-4f1b-b418-0b012ea079eb');
});
