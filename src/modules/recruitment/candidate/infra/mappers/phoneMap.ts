import { Phone } from '../../domain/phone';
import { PhoneDTO } from '../../domain/dtos/phoneDTO';
import { CandidateId } from '../../domain/candidateId';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

export class PhoneMap implements Mapper<Phone> {
  public static toDTO(phone: Phone): PhoneDTO {
    return {
      phoneId: phone.id.toString(),
      value: phone.value,
      candidateId: phone.candidateId.id.toString(),
    };
  }

  public static toDomain(raw: any): Phone {
    const phoneOrError = Phone.create(
      {
        value: raw.value,
        candidateId: CandidateId.create(raw.candidate_id).getValue(),
      },
      new UniqueEntityID(raw.phone_id),
    );

    phoneOrError.isFailure ? console.log(phoneOrError.error) : '';

    return phoneOrError.isSuccess ? phoneOrError.getValue() : null;
  }

  public static toPersistence(phone: Phone): any {
    return {
      phone_id: phone.phoneId.id.toString(),
      value: phone.value,
      candidate_id: phone.candidateId ? phone.candidateId.id.toString() : null,
    };
  }
}
