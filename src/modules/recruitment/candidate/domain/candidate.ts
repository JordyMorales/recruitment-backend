import { Tag } from './tag';
import { Link } from './link';
import { Email } from './email';
import { Phone } from './phone';
import { Technology } from './technology';
import { EnglishLevel } from './englishLevel';
import { CandidateId } from './candidateId';
import { User } from '../../../users/domain/user';
import { AggregateRoot } from '../../../../shared/domain/AggregateRoot';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { Result } from '../../../../shared/core/Result';

export interface CandidateProps {
  personalData?: User;
  address?: string;
  city?: string;
  country?: string;
  englishLevel?: EnglishLevel;
  engineeringLevel?: number;
  salaryPretension?: string;
  contractPreference?: string;
  jobTitle?: string;
  company?: string;
  resumeUrl?: string;
  seniority?: string;
  availability?: string;
  tags?: Tag[];
  links?: Link[];
  phones?: Phone[];
  emails?: Email[];
  technologies?: Technology[];
  referralBy?: User;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Candidate extends AggregateRoot<CandidateProps> {
  get candidateId(): CandidateId {
    return CandidateId.create(this._id).getValue();
  }

  get personalData(): User {
    return this.props.personalData;
  }

  get address(): string {
    return this.props.address;
  }

  get city(): string {
    return this.props.city;
  }

  get country(): string {
    return this.props.country;
  }

  get englishLevel(): EnglishLevel {
    return this.props.englishLevel;
  }

  get engineeringLevel(): number {
    return this.props.engineeringLevel;
  }

  get salaryPretension(): string {
    return this.props.salaryPretension;
  }

  get contractPreference(): string {
    return this.props.contractPreference;
  }

  get jobTitle(): string {
    return this.props.jobTitle;
  }

  get company(): string {
    return this.props.company;
  }

  get resumeUrl(): string {
    return this.props.resumeUrl;
  }

  get seniority(): string {
    return this.props.seniority;
  }

  get availability(): string {
    return this.props.availability;
  }
  get tags(): Tag[] {
    return this.props.tags;
  }

  get links(): Link[] {
    return this.props.links;
  }

  get emails(): Email[] {
    return this.props.emails;
  }

  get phones(): Phone[] {
    return this.props.phones;
  }

  get technologies(): Technology[] {
    return this.props.technologies;
  }

  get referralBy(): User {
    return this.props.referralBy;
  }

  get createdBy(): User {
    return this.props.createdBy;
  }

  get updatedBy(): User {
    return this.props.updatedBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.createdAt;
  }

  public addPhone(phone: Phone): void {
    const alreadyAdded = this.props.phones.find((p) => p.value === phone.value);
    if (!alreadyAdded) {
      this.props.phones.push(phone);
    }
  }

  public removePhone(phone: Phone): void {
    this.props.phones = this.props.phones.filter((p) => p.value !== phone.value);
  }

  public addEmail(email: Email): void {
    const alreadyAdded = this.props.emails.find((e) => e.value === email.value);
    if (!alreadyAdded) {
      this.props.emails.push(email);
    }
  }

  public removeEmail(email: Email): void {
    this.props.emails = this.props.emails.filter((e) => e.value !== email.value);
  }

  public addTechnology(technology: Technology): void {
    const alreadyAdded = this.props.technologies.find((t) => t.name === technology.name);
    if (!alreadyAdded) {
      this.props.technologies.push(technology);
    }
  }

  public removeTechnology(technology: Technology): void {
    this.props.technologies = this.props.technologies.filter((t) => t.name !== technology.name);
  }

  public addTag(tag: Tag): void {
    const alreadyAdded = this.props.tags.find((t) => t.name === tag.name);
    if (!alreadyAdded) {
      this.props.tags.push(tag);
    }
  }

  public removeTag(tag: Tag): void {
    this.props.tags = this.props.tags.filter((t) => t.name !== tag.name);
  }

  public addLink(link: Link): void {
    const alreadyAdded = this.props.links.find((l) => l.value === link.value);
    if (!alreadyAdded) {
      this.props.links.push(link);
    }
  }

  public removeLink(link: Link): void {
    this.props.links = this.props.links.filter((l) => l.value !== link.value);
  }

  private constructor(props: CandidateProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: CandidateProps, id?: UniqueEntityID): Result<Candidate> {
    const values = {
      ...props,
      personalData: props.personalData ? props.personalData : null,
      address: props.address ? props.address : null,
      city: props.city ? props.city : null,
      country: props.country ? props.country : null,
      englishLevel: props.englishLevel ? props.englishLevel : null,
      engineeringLevel: props.engineeringLevel ? props.engineeringLevel : null,
      salaryPretension: props.salaryPretension ? props.salaryPretension : null,
      contractPreference: props.contractPreference ? props.contractPreference : null,
      jobTitle: props.jobTitle ? props.jobTitle : null,
      company: props.company ? props.company : null,
      resumeUrl: props.resumeUrl ? props.resumeUrl : null,
      seniority: props.seniority ? props.seniority : null,
      availability: props.availability ? props.availability : null,
      tags: props.tags ? props.tags : [],
      links: props.links ? props.links : [],
      phones: props.phones ? props.phones : [],
      emails: props.emails ? props.emails : [],
      technologies: props.technologies ? props.technologies : [],
      referralBy: props.referralBy ? props.referralBy : null,
      createdBy: props.createdBy ? props.createdBy : null,
      updatedBy: props.updatedBy ? props.updatedBy : null,
      createdAt: props.createdAt ? props.createdAt : new Date(),
      updatedAt: props.updatedAt ? props.updatedAt : null,
    };

    const candidate = new Candidate(values, id);

    return Result.ok<Candidate>(candidate);
  }
}
