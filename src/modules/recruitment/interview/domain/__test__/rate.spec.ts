import { Rate } from './../rate';
import { InterviewId } from './../interviewId';
import { InterviewerId } from './../interviewerId';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

let rate: Rate;
let rateOrError: Result<Rate>;

test('Should be able to create a comment', () => {
  rateOrError = Rate.create({
    note: 'note',
    rate: 1.2,
    pros: 'pros',
    cons: 'cons',
    ratedBy: InterviewerId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
    interviewId: InterviewId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
  });
  expect(rateOrError.isSuccess).toBe(true);
  rate = rateOrError.getValue();
  expect(rate.note).toBe('note');
  expect(rate.rate).toBe(1.2);
  expect(rate.pros).toBe('pros');
  expect(rate.cons).toBe('cons');
});
