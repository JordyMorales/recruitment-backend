import { Email } from '../../domain/email';
import { EmailDTO } from '../../domain/dtos/emailDTO';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';
import { CandidateId } from '../../domain/candidateId';

export class EmailMap implements Mapper<Email> {
  public static toDTO(email: Email): EmailDTO {
    return {
      emailId: email.id.toString(),
      value: email.value,
      candidateId: email.candidateId.id.toString(),
    };
  }

  public static toDomain(raw: any): Email {
    const emailOrError = Email.create(
      {
        value: raw.value,
        candidateId: CandidateId.create(raw.candidate_id).getValue(),
      },
      new UniqueEntityID(raw.email_id),
    );

    emailOrError.isFailure ? console.log(emailOrError.error) : '';

    return emailOrError.isSuccess ? emailOrError.getValue() : null;
  }

  public static toPersistence(email: Email): any {
    return {
      email_id: email.emailId.id.toString(),
      value: email.value,
      candidate_id: email.candidateId ? email.candidateId.id.toString() : null,
    };
  }
}
