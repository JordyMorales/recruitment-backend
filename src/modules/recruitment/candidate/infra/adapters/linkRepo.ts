import { injectable } from 'inversify';
import { Link } from '../../domain/link';
import { LinkMap } from '../mappers/linkMap';
import { CandidateId } from '../../domain/candidateId';
import { ILinkRepo } from '../../domain/ports/ILinkRepo';
import models from '../../../../../shared/infra/database/sequelize/models';


@injectable()
export class LinkRepo implements ILinkRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(link: string): Promise<boolean> {
    const LinkModel = this.models.Link;
    const linkFound = await LinkModel.findOne({
      where: { value: link },
    });
    return !!linkFound === true;
  }
  async getCandidateLinks(candidateId: CandidateId): Promise<Link[]> {
    const LinkModel = this.models.Link;
    const links = await LinkModel.findAll({
      where: { candidate_id: candidateId.id.toString() },
    });
    return links.map((link) => LinkMap.toDomain(link));
  }
  async save(link: Link): Promise<void> {
    const LinkModel = this.models.Link;
    try {
      const exists = await this.exists(link.value);
      if (!exists) {
        const raw = LinkMap.toPersistence(link);
        await LinkModel.create(raw);
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async update(link: Link): Promise<void> {
    const LinkModel = this.models.Link;
    try {
      const exists = await this.exists(link.value);
      if (exists) {
        const raw = LinkMap.toPersistence(link);
        await LinkModel.update(raw, { where: { link_id: link.linkId.id.toString() } });
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async delete(link: Link): Promise<void> {
    const LinkModel = this.models.Link;
    return LinkModel.destroy({ where: { link_id: link.linkId.id.toString() } });
  }
}
