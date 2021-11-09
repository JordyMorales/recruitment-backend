import { UserId } from './userId';
import { UserEmail } from './userEmail';
import { UserPassword } from './userPassword';
import { Role } from './role';
import { State } from './state';
import { UserCreated } from './events/userCreated';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Result } from '../../../shared/core/Result';
import { Guard } from '../../../shared/core/Guard';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';

export interface UserProps {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: UserEmail;
  password?: UserPassword;
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

export class User extends AggregateRoot<UserProps> {
  get userId(): UserId {
    return UserId.create(this._id).getValue();
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get middleName(): string {
    return this.props.middleName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): UserEmail {
    return this.props.email;
  }

  get password(): UserPassword {
    return this.props.password;
  }

  get phone(): string {
    return this.props.phone;
  }

  get dateOfBirth(): Date {
    return this.props.dateOfBirth;
  }

  get country(): string {
    return this.props.country;
  }

  get city(): string {
    return this.props.city;
  }

  get address(): string {
    return this.props.address;
  }

  get photoUrl(): string {
    return this.props.photoUrl;
  }

  get resumeUrl(): string {
    return this.props.resumeUrl;
  }

  get jobTitle(): string {
    return this.props.jobTitle;
  }

  get role(): Role {
    return this.props.role;
  }

  get state(): State {
    return this.props.state;
  }

  private constructor(props: UserProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: UserProps, id?: UniqueEntityID): Result<User> {
    const nullGuard = Guard.againstNullOrUndefinedBulk([
      { argument: props.firstName, argumentName: 'firstName' },
      { argument: props.lastName, argumentName: 'lastName' },
      { argument: props.email, argumentName: 'email' },
    ]);

    if (!nullGuard.succeeded) {
      return Result.fail<User>(nullGuard.message);
    }

    const isNewUser = !!id === false;

    const values = {
      ...props,
      middleName: props.middleName ? props.middleName : null,
      password: props.password ? props.password : null,
      phone: props.phone ? props.phone : null,
      dateOfBirth: props.dateOfBirth ? props.dateOfBirth : null,
      country: props.country ? props.country : null,
      city: props.city ? props.city : null,
      address: props.address ? props.address : null,
      photoUrl: props.photoUrl ? props.photoUrl : null,
      resumeUrl: props.resumeUrl ? props.resumeUrl : null,
      jobTitle: props.jobTitle ? props.jobTitle : null,
      role: props.role ? props.role : 'CANDIDATE',
      state: props.state ? props.state : 'ACTIVE',
    };

    const user = new User(values, id);

    if (isNewUser) {
      user.addDomainEvent(new UserCreated(user));
    }

    return Result.ok<User>(user);
  }
}
