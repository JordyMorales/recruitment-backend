import { injectable } from 'inversify';
import { Phone } from '../../domain/phone';
import { PhoneMap } from '../mappers/phoneMap';
import { IPhoneRepo } from '../../domain/ports/IPhoneRepo';
import { CandidateId } from '../../domain/candidateId';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class PhoneRepo implements IPhoneRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(phone: string): Promise<boolean> {
    const PhoneModel = this.models.Phone;
    const phoneFound = await PhoneModel.findOne({
      where: { value: phone },
    });
    return !!phoneFound === true;
  }
  async getCandidatePhones(candidateId: CandidateId): Promise<Phone[]> {
    const PhoneModel = this.models.Phone;
    const phones = await PhoneModel.findAll({
      where: { candidate_id: candidateId.id.toString() },
    });
    return phones.map((phone) => PhoneMap.toDomain(phone));
  }
  async save(phone: Phone): Promise<void> {
    const PhoneModel = this.models.Phone;
    try {
      const exists = await this.exists(phone.value);
      if (!exists) {
        const raw = PhoneMap.toPersistence(phone);
        await PhoneModel.create(raw);
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async update(phone: Phone): Promise<void> {
    const PhoneModel = this.models.Phone;
    try {
      const exists = await this.exists(phone.value);
      if (exists) {
        const raw = PhoneMap.toPersistence(phone);
        await PhoneModel.update(raw, {
          where: { candidate_id: phone.phoneId.id.toString() },
        });
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async delete(phone: Phone): Promise<void> {
    const PhoneModel = this.models.Phone;
    return PhoneModel.destroy({ where: { phone_id: phone.phoneId.id.toString() } });
  }
}
