import { EnglishLevel } from './../../domain/englishLevel';

export interface UpdateCandidateRequestDTO {
  userId: string;
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
  tags?: any[];
  links?: any[];
  phones?: any[];
  emails?: any[];
  technologies?: any[];
  referralBy?: any;
  createdBy: any;
  updatedBy?: any;
  createdAt?: Date;
  updatedAt?: Date;
}
