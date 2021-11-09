import { State } from '../../domain/state';
import { Role } from '../../domain/role';

export interface UpdateUserRequestDTO {
  userId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  country?: string;
  city?: string;
  address?: string;
  photoUrl?: string;
  resumeUrl?: string;
  jobTitle?: string;
  role?: Role;
  state?: State;
}
