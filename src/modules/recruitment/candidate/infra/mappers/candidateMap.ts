import { Candidate } from '../../domain/candidate';
import { CandidateDTO } from '../../domain/dtos/candidateDTO';
import { Technology } from '../../domain/technology';
import { Phone } from '../../domain/phone';
import { Email } from '../../domain/email';
import { Link } from '../../domain/link';
import { Tag } from '../../domain/tag';
import { TagMap } from './tagMap';
import { LinkMap } from './linkMap';
import { PhoneMap } from './phoneMap';
import { EmailMap } from './emailMap';
import { TechnologyMap } from './technologyMap';
import { UserMap } from '../../../../users/infra/mappers/userMap';
import { Result } from '../../../../../shared/core/Result';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { Mapper } from '../../../../../shared/infra/Mapper';

const emailsToDomain = (emails: any[]): Email[] => {
  return emails.map(({ email_id, value, candidate_id: candidateId }) => {
    const emailOrError: Result<Email> = Email.create({ value, candidateId }, email_id);
    if (emailOrError.isSuccess) return emailOrError.getValue();
  });
};
const phonesToDomain = (phones: any[]): Phone[] => {
  return phones.map(({ phone_id, value, candidate_id: candidateId }) => {
    const phoneOrError: Result<Phone> = Phone.create({ value, candidateId }, phone_id);
    if (phoneOrError.isSuccess) return phoneOrError.getValue();
  });
};
const linksToDomain = (links: any[]): Link[] => {
  return links.map(({ link_id, value, candidate_id: candidateId }) => {
    const linkOrError: Result<Link> = Link.create({ value, candidateId }, link_id);
    if (linkOrError.isSuccess) return linkOrError.getValue();
  });
};
const tagsToDomain = (tags: any[]): Tag[] => {
  return tags.map(({ tag_id, name, color }) => {
    const tagOrError: Result<Tag> = Tag.create({ name, color }, tag_id);
    if (tagOrError.isSuccess) return tagOrError.getValue();
  });
};
const technologiesToDomain = (technologies: any[]): Technology[] => {
  return technologies.map(({ technology_id, name }) => {
    const technologyOrError: Result<Technology> = Technology.create({ name }, technology_id);
    if (technologyOrError.isSuccess) return technologyOrError.getValue();
  });
};

export class CandidateMap implements Mapper<Candidate> {
  public static toDTO(candidate: Candidate): CandidateDTO {
    return {
      candidateId: candidate.id.toString(),
      personalData: candidate.personalData ? UserMap.toDTO(candidate.personalData) : null,
      address: candidate.address ? candidate.address : null,
      city: candidate.city ? candidate.city : null,
      country: candidate.country ? candidate.country : null,
      englishLevel: candidate.englishLevel ? candidate.englishLevel : null,
      engineeringLevel: candidate.engineeringLevel ? candidate.engineeringLevel : null,
      salaryPretension: candidate.salaryPretension ? candidate.salaryPretension : null,
      contractPreference: candidate.contractPreference ? candidate.contractPreference : null,
      jobTitle: candidate.jobTitle ? candidate.jobTitle : null,
      company: candidate.company ? candidate.company : null,
      resumeUrl: candidate.resumeUrl ? candidate.resumeUrl : null,
      seniority: candidate.seniority ? candidate.seniority : null,
      availability: candidate.availability ? candidate.availability : null,
      tags: candidate.tags ? candidate.tags.map((tag) => TagMap.toDTO(tag)) : [],
      links: candidate.links ? candidate.links.map((link) => link.value) : [],
      phones: candidate.phones.length ? candidate.phones.map((phone) => phone.value) : [],
      emails: candidate.emails.length ? candidate.emails.map((email) => email.value) : [],
      technologies: candidate.technologies ? candidate.technologies.map((t) => TechnologyMap.toDTO(t)) : [],
      referralBy: candidate.referralBy ? UserMap.toDTO(candidate.referralBy) : null,
      createdBy: UserMap.toDTO(candidate.createdBy),
      updatedBy: candidate.updatedBy ? UserMap.toDTO(candidate.updatedBy) : null,
      createdAt: candidate.createdAt,
      updatedAt: candidate.updatedAt ? candidate.updatedAt : null,
    };
  }

  public static toDomain(raw: any): Candidate {
    const candidateOrError = Candidate.create(
      {
        personalData: raw.user ? UserMap.toDomain(raw.user) : null,
        address: raw.address ? raw.address : null,
        city: raw.city ? raw.city : null,
        country: raw.country ? raw.country : null,
        englishLevel: raw.english_level ? raw.english_level : null,
        engineeringLevel: raw.engineering_level ? raw.engineering_level : null,
        salaryPretension: raw.salary_pretension ? raw.salary_pretension : null,
        contractPreference: raw.contract_preference ? raw.contract_preference : null,
        jobTitle: raw.job_title ? raw.job_title : null,
        company: raw.company ? raw.company : null,
        resumeUrl: raw.resume_url ? raw.resume_url : null,
        seniority: raw.seniority ? raw.seniority : null,
        availability: raw.availability ? raw.availability : null,
        tags: raw.tags ? tagsToDomain(raw.tags) : [],
        links: raw.links ? linksToDomain(raw.links) : [],
        phones: raw.phones ? phonesToDomain(raw.phones) : [],
        emails: raw.emails ? emailsToDomain(raw.emails) : [],
        technologies: raw.technologies ? technologiesToDomain(raw.technologies) : [],
        referralBy: raw.referral ? UserMap.toDomain(raw.referralBy) : null,
        createdBy: UserMap.toDomain(raw.createdBy),
        updatedBy: raw.updated_by ? UserMap.toDomain(raw.updatedBy) : null,
        createdAt: raw.created_at,
        updatedAt: raw.updated_at ? raw.updated_at : null,
      },
      new UniqueEntityID(raw.candidate_id),
    );

    candidateOrError.isFailure ? console.log(candidateOrError.error) : '';

    return candidateOrError.isSuccess ? candidateOrError.getValue() : null;
  }

  public static toPersistence(candidate: Candidate): any {
    return {
      candidate_id: candidate.id.toString(),
      phones: candidate.phones.length ? candidate.phones.map((phone) => PhoneMap.toPersistence(phone)) : [],
      emails: candidate.emails.length ? candidate.emails.map((email) => EmailMap.toPersistence(email)) : [],
      address: candidate.address ? candidate.address : null,
      city: candidate.city ? candidate.city : null,
      country: candidate.country ? candidate.country : null,
      english_level: candidate.englishLevel ? candidate.englishLevel : null,
      engineering_level: candidate.engineeringLevel ? candidate.engineeringLevel : null,
      salary_pretension: candidate.salaryPretension ? candidate.salaryPretension : null,
      contract_preference: candidate.contractPreference ? candidate.contractPreference : null,
      job_title: candidate.jobTitle ? candidate.jobTitle : null,
      company: candidate.company ? candidate.company : null,
      resume_url: candidate.resumeUrl ? candidate.resumeUrl : null,
      seniority: candidate.seniority ? candidate.seniority : null,
      availability: candidate.availability ? candidate.availability : null,
      technologies: candidate.technologies.length
        ? candidate.technologies.map((t) => TechnologyMap.toPersistence(t))
        : [],
      tags: candidate.tags.length ? candidate.tags.map((tag) => TagMap.toPersistence(tag)) : [],
      links: candidate.links.length ? candidate.links.map((link) => LinkMap.toPersistence(link)) : [],
      referral_by: candidate.referralBy ? candidate.referralBy.id.toString() : null,
      created_by: candidate.createdBy.id.toString(),
      updated_by: candidate.updatedBy ? candidate.updatedBy.id.toString() : null,
      created_at: candidate.createdAt,
      updated_at: candidate.updatedAt ? candidate.updatedAt : null,
    };
  }
}
