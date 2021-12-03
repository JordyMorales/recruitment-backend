import { CandidateId } from './../candidateId';
import { Link } from '../link';
import { Tag } from '../tag';
import { Technology } from '../technology';
import { Email } from '../email';
import { Phone } from '../phone';
import { Candidate } from '../candidate';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

const candidateId: CandidateId = CandidateId.create(
  new UniqueEntityID('3700fbfb-12bb-475a-88a3-393cf16ab9d6'),
).getValue();

let candidate: Candidate;
let candidateOrError: Result<Candidate>;

const phones: Phone[] = [Phone.create({ value: '+59161787036', candidateId }).getValue()];
const emails: Email[] = [Email.create({ value: 'jordy.morales@nearshorecode.com', candidateId }).getValue()];
const technologies: Technology[] = [Technology.create({ name: 'React JS', isActive: true }).getValue()];
const tags: Tag[] = [Tag.create({ name: 'Direct contact', color: '#FF5733' }).getValue()];
const links: Link[] = [
  Link.create({ value: 'https://www.linkedin.com/in/jordymorales', candidateId }).getValue(),
];

test('Should be able to create a candidate', () => {
  candidateOrError = Candidate.create({
    phones,
    emails,
    technologies,
    tags,
    links,
  });
  expect(candidateOrError.isSuccess).toBe(true);
  candidate = candidateOrError.getValue();

  // handle the phones
  expect(candidate.phones.length).toEqual(1);
  const phone = Phone.create({ value: '+59161615088', candidateId }).getValue();
  candidate.addPhone(phone);
  expect(candidate.phones.length).toEqual(2);
  candidate.removePhone(phone);
  expect(candidate.phones.length).toEqual(1);

  // handle the emails
  expect(candidate.emails.length).toEqual(1);
  const email = Email.create({ value: 'jordy.morales@conversica.com', candidateId }).getValue();
  candidate.addEmail(email);
  expect(candidate.emails.length).toEqual(2);
  candidate.removeEmail(email);
  expect(candidate.emails.length).toEqual(1);

  // handle the technologies
  expect(candidate.technologies.length).toEqual(1);
  const technology = Technology.create({ name: 'Angular JS', isActive: true }).getValue();
  candidate.addTechnology(technology);
  expect(candidate.technologies.length).toEqual(2);
  candidate.removeTechnology(technology);
  expect(candidate.technologies.length).toEqual(1);

  // handle the tags
  expect(candidate.tags.length).toEqual(1);
  const tag = Tag.create({ name: 'Referral', color: '#F3FF33' }).getValue();
  candidate.addTag(tag);
  expect(candidate.tags.length).toEqual(2);
  candidate.removeTag(tag);
  expect(candidate.tags.length).toEqual(1);

  // handle the links
  expect(candidate.links.length).toEqual(1);
  const link = Link.create({ value: 'https://www.google.com', candidateId }).getValue();
  candidate.addLink(link);
  expect(candidate.links.length).toEqual(2);
  candidate.removeLink(link);
  expect(candidate.links.length).toEqual(1);
});
