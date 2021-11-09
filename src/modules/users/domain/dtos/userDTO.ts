import { State } from '../state';
import { Role } from '../role';

export interface UserDTO {
  userId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password?: string;
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
