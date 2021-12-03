import { Phone } from './../phone';
import { CandidateId } from './../candidateId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Result } from '../../../../../shared/core/Result';
let phone: Phone;
let phoneOrError: Result<Phone>;

test('Should be able to create a phone', () => {
  phoneOrError = Phone.create({
    value: '+59161787036',
    candidateId: CandidateId.create(new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6')).getValue(),
  });
  expect(phoneOrError.isSuccess).toBe(true);
  phone = phoneOrError.getValue();
  expect(phone.value).toBe('+59161787036');
});
