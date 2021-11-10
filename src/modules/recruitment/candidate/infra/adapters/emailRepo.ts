import { injectable } from 'inversify';
import { Email } from '../../domain/email';
import { EmailMap } from '../mappers/emailMap';
import { IEmailRepo } from '../../domain/ports/IEmailRepo';
import { CandidateId } from '../../domain/candidateId';
import models from '../../../../../shared/infra/database/sequelize/models';


@injectable()
export class EmailRepo implements IEmailRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(email: string): Promise<boolean> {
    const EmailModel = this.models.Email;
    const emailFound = await EmailModel.findOne({
      where: { value: email },
    });
    return !!emailFound === true;
  }
  async getCandidateEmails(candidateId: CandidateId): Promise<Email[]> {
    const EmailModel = this.models.Email;
    const emails = await EmailModel.findAll({
      where: { candidate_id: candidateId.id.toString() },
    });
    return emails.map((email) => EmailMap.toDomain(email));
  }
  async save(email: Email): Promise<void> {
    const EmailModel = this.models.Email;
    try {
      const exists = await this.exists(email.value);
      if (!exists) {
        const raw = EmailMap.toPersistence(email);
        await EmailModel.create(raw);
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async update(email: Email): Promise<void> {
    const EmailModel = this.models.Email;
    try {
      const exists = await this.exists(email.value);
      if (exists) {
        const raw = EmailMap.toPersistence(email);
        await EmailModel.update(raw, { where: { email_id: email.emailId.id.toString() } });
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async delete(email: Email): Promise<void> {
    const EmailModel = this.models.Email;
    return EmailModel.destroy({ where: { email_id: email.emailId.id.toString() } });
  }
}
