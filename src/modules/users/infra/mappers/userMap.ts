import { User } from '../../domain/user';
import { UserEmail } from '../../domain/userEmail';
import { UserDTO } from '../../domain/dtos/userDTO';
import { Mapper } from '../../../../shared/infra/Mapper';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';

export class UserMap implements Mapper<User> {
  public static toDTO(user: User): UserDTO {
    return {
      userId: user.userId.id.toString(),
      firstName: user.firstName,
      middleName: user.middleName ? user.middleName : null,
      lastName: user.lastName ? user.lastName : null,
      email: user.email ? user.email.value : null,
      phone: user.phone ? user.phone : null,
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth : null,
      country: user.country ? user.country : null,
      city: user.city ? user.city : null,
      address: user.address ? user.address : null,
      photoUrl: user.photoUrl ? user.photoUrl : null,
      resumeUrl: user.resumeUrl ? user.resumeUrl : null,
      jobTitle: user.jobTitle ? user.jobTitle : null,
      state: user.state,
      role: user.role,
    };
  }

  public static dtoToDomain(user: any): User {
    const emailOrError = UserEmail.create(user.email);

    const userOrError = User.create(
      {
        firstName: user.firstName,
        middleName: user.middleName ? user.middleName : null,
        lastName: user.lastName ? user.lastName : null,
        email: emailOrError.getValue(),
        phone: user.phone ? user.phone : null,
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth : null,
        country: user.country ? user.country : null,
        city: user.city ? user.city : null,
        address: user.address ? user.address : null,
        photoUrl: user.photoUrl ? user.photoUrl : null,
        resumeUrl: user.resumeUrl ? user.resumeUrl : null,
        jobTitle: user.jobTitle ? user.jobTitle : null,
        state: user.state,
        role: user.role,
      },
      new UniqueEntityID(user.userId),
    );

    userOrError.isFailure ? console.log(userOrError.error) : '';

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static toDomain(raw: any): User {
    const emailOrError = UserEmail.create(raw.email);

    const userOrError = User.create(
      {
        firstName: raw.first_name,
        middleName: raw.middle_name ? raw.middle_name : null,
        lastName: raw.last_name ? raw.last_name : null,
        email: emailOrError.getValue(),
        phone: raw.phone ? raw.phone : null,
        dateOfBirth: raw.date_of_birth ? raw.date_of_birth : null,
        country: raw.country ? raw.country : null,
        city: raw.city ? raw.city : null,
        address: raw.address ? raw.address : null,
        photoUrl: raw.photo_url ? raw.photo_url : null,
        resumeUrl: raw.resume_url ? raw.resume_url : null,
        jobTitle: raw.job_title ? raw.job_title : null,
        state: raw.state,
        role: raw.role,
      },
      new UniqueEntityID(raw.user_id),
    );

    userOrError.isFailure ? console.log(userOrError.error) : '';

    return userOrError.isSuccess ? userOrError.getValue() : null;
  }

  public static async toPersistence(user: User): Promise<any> {
    return {
      user_id: user.userId.id.toString(),
      first_name: user.firstName,
      middle_name: user.middleName ? user.middleName : null,
      last_name: user.lastName,
      email: user.email.value,
      phone: user.phone ? user.phone : null,
      date_of_birth: user.dateOfBirth ? user.dateOfBirth : null,
      country: user.country ? user.country : null,
      city: user.city ? user.city : null,
      address: user.address ? user.address : null,
      photo_url: user.photoUrl ? user.photoUrl : null,
      resume_url: user.resumeUrl ? user.resumeUrl : null,
      job_title: user.jobTitle ? user.jobTitle : null,
      role: user.role,
      state: user.state,
    };
  }
}
