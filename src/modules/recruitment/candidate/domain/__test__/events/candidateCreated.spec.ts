import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';
import { Candidate } from './../../candidate';
import { CandidateCreated } from '../../events/candidateCreated';

test('Should be able to create a CandidateCreated Event', () => {
  const id: UniqueEntityID = new UniqueEntityID('210e5965-5902-40c4-8f89-e9c2fa412550');
  const candidate: Candidate = Candidate.create({}, id).getValue();
  const candidateCreated: CandidateCreated = new CandidateCreated(candidate);
  expect(candidateCreated.getAggregateId()).toBe(id);
});
