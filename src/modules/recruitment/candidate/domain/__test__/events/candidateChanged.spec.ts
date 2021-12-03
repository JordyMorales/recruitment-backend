import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { Candidate } from '../../candidate';
import { CandidateChanged } from '../../events/candidateChanged';

test('Should be able to create a CandidateChanged Event', () => {
  const id: UniqueEntityID = new UniqueEntityID('210e5965-5902-40c4-8f89-e9c2fa412550');
  const candidate: Candidate = Candidate.create({}, id).getValue();
  const candidateChanged: CandidateChanged = new CandidateChanged(candidate);
  expect(candidateChanged.getAggregateId()).toBe(id);
});
