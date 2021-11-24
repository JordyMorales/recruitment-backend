import { injectable } from 'inversify';
import { Candidate } from '../../domain/candidate';
import { CandidateId } from '../../domain/candidateId';
import { CandidateMap } from '../mappers/candidateMap';
import { ICandidateRepo } from '../../domain/ports/ICandidateRepo';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class CandidateRepo implements ICandidateRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(candidateId: CandidateId): Promise<boolean> {
    const CandidateModel = this.models.Candidate;
    const candidateFound = await CandidateModel.findOne({
      where: { candidate_id: candidateId.id.toString() },
    });
    return !!candidateFound === true;
  }
  async getCandidateById(candidateId: CandidateId): Promise<Candidate> {
    const CandidateModel = this.models.Candidate;
    const candidateFound = await CandidateModel.findByPk(candidateId.id.toString(), {
      include: [
        { model: this.models.Email, as: 'emails' },
        { model: this.models.Phone, as: 'phones' },
        { model: this.models.Link, as: 'links' },
        { model: this.models.Tag },
        { model: this.models.Technology },
        {
          model: this.models.User,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone', 'photo_url', 'state', 'role'],
        },
        {
          model: this.models.User,
          as: 'referralBy',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone', 'photo_url', 'state', 'role'],
        },
        {
          model: this.models.User,
          as: 'createdBy',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone', 'photo_url', 'state', 'role'],
        },
        {
          model: this.models.User,
          as: 'updatedBy',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone', 'photo_url', 'state', 'role'],
        },
      ],
    });
    if (!!candidateFound === false) throw new Error('Candidate not found.');

    return CandidateMap.toDomain(candidateFound);
  }
  async searchAll(): Promise<Candidate[]> {
    const CandidateModel = this.models.Candidate;
    const response = await CandidateModel.findAll({
      include: [
        { model: this.models.Email, as: 'emails' },
        { model: this.models.Phone, as: 'phones' },
        { model: this.models.Link, as: 'links' },
        { model: this.models.Tag },
        { model: this.models.Technology },
        {
          model: this.models.User,
          as: 'user',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone', 'photo_url', 'state', 'role'],
        },
        {
          model: this.models.User,
          as: 'referralBy',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone', 'photo_url', 'state', 'role'],
        },
        {
          model: this.models.User,
          as: 'createdBy',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone', 'photo_url', 'state', 'role'],
        },
        {
          model: this.models.User,
          as: 'updatedBy',
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'phone', 'photo_url', 'state', 'role'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
    return response.map((candidate) => CandidateMap.toDomain(candidate));
  }
  async save(candidate: Candidate): Promise<void> {
    const CandidateModel = this.models.Candidate;
    const transaction = await models['sequelize'].transaction();
    try {
      const exists = await this.exists(candidate.candidateId);
      if (!exists) {
        const raw = CandidateMap.toPersistence(candidate);

        const candidateCreated = await CandidateModel.create(raw, {
          include: [
            { model: this.models.Email, as: 'emails' },
            { model: this.models.Phone, as: 'phones' },
            { model: this.models.Link, as: 'links' },
          ],
          transaction,
        });

        await Promise.all(
          raw.tags.map(async (tag) => {
            const tagFound = await this.models.Tag.findOne({ where: { name: tag.name } });
            if (!!tagFound === false) {
              const resp = await this.models.Tag.create(tag, { transaction });
              await candidateCreated.addTag(resp, { transaction });
            } else {
              await candidateCreated.addTag(tagFound, { transaction });
            }
          }),
        );

        await Promise.all(
          raw.technologies.map(async (tech) => {
            const techFound = await this.models.Technology.findOne({ where: { name: tech.name } });
            if (!!techFound === false) {
              const resp = await this.models.Technology.create(tech, { transaction });
              await candidateCreated.addTechnology(resp, { transaction });
            } else {
              await candidateCreated.addTechnology(techFound, { transaction });
            }
          }),
        );
        await transaction.commit();
      }
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw new Error(error.toString());
    }
  }
  async update(candidate: Candidate): Promise<void> {
    const CandidateModel = this.models.Candidate;
    const transaction = await models['sequelize'].transaction();
    try {
      const raw = CandidateMap.toPersistence(candidate);
      const candidateInstance = await CandidateModel.findByPk(candidate.candidateId.id.toString());
      await candidateInstance.update(raw, { transaction });

      // await candidateInstance.setEmails([], { transaction });
      await this.models.Email.destroy({
        where: { candidate_id: candidate.candidateId.id.toString() },
        transaction,
      });

      // await candidateInstance.setPhones([], { transaction });
      await this.models.Phone.destroy({
        where: { candidate_id: candidate.candidateId.id.toString() },
        transaction,
      });

      // await candidateInstance.setLinks([], { transaction });
      await this.models.Link.destroy({
        where: { candidate_id: candidate.candidateId.id.toString() },
        transaction,
      });

      await candidateInstance.setTags([], { transaction });
      await candidateInstance.setTechnologies([], { transaction });

      await Promise.all(
        raw.emails.map(async (email) => {
          await candidateInstance.createEmail(email, { transaction });
        }),
      );
      await Promise.all(
        raw.phones.map(async (phone) => {
          await candidateInstance.createPhone(phone, { transaction });
        }),
      );
      await Promise.all(
        raw.links.map(async (link) => {
          await candidateInstance.createLink(link, { transaction });
        }),
      );

      await Promise.all(
        raw.tags.map(async (tag) => {
          const tagFound = await this.models.Tag.findOne({ where: { name: tag.name } });
          if (!!tagFound === false) {
            const resp = await this.models.Tag.create(tag, { transaction });
            await candidateInstance.addTag(resp, { transaction });
          } else {
            await candidateInstance.addTag(tagFound, { transaction });
          }
        }),
      );

      await Promise.all(
        raw.technologies.map(async (tech) => {
          const techFound = await this.models.Technology.findOne({ where: { name: tech.name } });
          if (!!techFound === false) {
            const resp = await this.models.Technology.create(tech, { transaction });
            await candidateInstance.addTechnology(resp, { transaction });
          } else {
            await candidateInstance.addTechnology(techFound, { transaction });
          }
        }),
      );
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw new Error(error.toString());
    }
  }
}
