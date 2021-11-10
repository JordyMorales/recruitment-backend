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
        this.models.Email,
        this.models.Phone,
        this.models.Link,
        this.models.Tag,
        this.models.Technology,
        this.models.User,
      ]
    });
    if (!!candidateFound === false) throw new Error('Candidate not found.');

    return CandidateMap.toDomain(candidateFound);
  }
  async searchAll(): Promise<Candidate[]> {
    const CandidateModel = this.models.Candidate;
    const response = await CandidateModel.findAll({
      include: [
        this.models.Email,
        this.models.Phone,
        this.models.Link,
        this.models.Tag,
        this.models.Technology,
        this.models.User,
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
          include: [this.models.Email, this.models.Phone, this.models.Link],
          transaction,
        });

        await Promise.all(
          raw.tags.map(async (t) => {
            const tag = await this.models.Tag.findByPk(t.tag_id);
            await candidateCreated.addTag(tag, { transaction });
          }),
        );

        await Promise.all(
          raw.technologies.map(async (t) => {
            const technology = await this.models.Technology.findByPk(t.technology_id);
            await candidateCreated.addTechnology(technology, { transaction });
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
    throw new Error('Method not implemented.');
  }
}
