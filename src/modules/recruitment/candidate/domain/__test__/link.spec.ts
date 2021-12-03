import { Link } from './../link';
import { CandidateId } from './../candidateId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Result } from '../../../../../shared/core/Result';

let link: Link;
let linkOrError: Result<Link>;
let candidateId: CandidateId = CandidateId.create(
  new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6'),
).getValue();

test('Should be able to create a link', () => {
  linkOrError = Link.create({ value: 'https://www.linkedin.com/in/jordymorales', candidateId });
  expect(linkOrError.isSuccess).toBe(true);
  link = linkOrError.getValue();
  expect(link.value).toBe('https://www.linkedin.com/in/jordymorales');
});

test('Should fail when link is invalid', () => {
  linkOrError = Link.create({ value: 'in/jordymorales', candidateId });
  expect(linkOrError.isFailure).toBe(true);
  expect(linkOrError.error).toBe('Url {in/jordymorales} is not valid.');
});
