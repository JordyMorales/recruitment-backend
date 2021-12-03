import { Rate } from './../../rate';
import { InterviewId } from './../../interviewId';
import { InterviewerId } from './../../interviewerId';
import { RateCreated } from './../../events/rateCreated';
import { UniqueEntityID } from '../../../../../../shared/domain/UniqueEntityID';

test('Should be able to create a RateCreated Event', () => {
  const id: UniqueEntityID = new UniqueEntityID('210e5965-5902-40c4-8f89-e9c2fa412550');
  const rate = Rate.create(
    {
      note: 'note',
      rate: 1.2,
      pros: 'pros',
      cons: 'cons',
      ratedBy: InterviewerId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
      interviewId: InterviewId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
    },
    id,
  ).getValue();

  const rateCreated: RateCreated = new RateCreated(rate);
  expect(rateCreated.getAggregateId()).toBe(id);
});
