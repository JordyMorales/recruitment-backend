import { injectable } from 'inversify';
import { Technology } from '../../domain/technology';
import { TechnologyId } from '../../domain/technologyId';
import { TechnologyMap } from '../mappers/technologyMap';
import { ITechnologyRepo } from '../../domain/ports/ITechnologyRepo';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class TechnologyRepo implements ITechnologyRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(technology: string): Promise<boolean> {
    const TechnologyModel = this.models.Technology;
    const technologyFound = await TechnologyModel.findOne({
      where: { name: technology },
    });
    return !!technologyFound === true;
  }
  async getTechnologyById(technologyId: TechnologyId): Promise<Technology> {
    const TechnologyModel = this.models.Technology;
    const technologyFound = await TechnologyModel.findByPk(technologyId.id.toString());

    if (!!technologyFound === false) throw new Error('Technology not found.');

    return TechnologyMap.toDomain(technologyFound);
  }
  async searchTechnologies(isActive: boolean): Promise<Technology[]> {
    const TechnologyModel = this.models.Technology;
    const technologies = await TechnologyModel.findAll({
      where: { is_active: isActive },
    });
    return technologies.map((technology) => TechnologyMap.toDomain(technology));
  }
  async getAllTechnologies(): Promise<Technology[]> {
    const TechnologyModel = this.models.Technology;
    const technologies = await TechnologyModel.findAll();
    return technologies.map((technology) => TechnologyMap.toDomain(technology));
  }
  async save(technology: Technology): Promise<void> {
    const TechnologyModel = this.models.Technology;
    try {
      const exists = await this.exists(technology.name);
      if (!exists) {
        const raw = TechnologyMap.toPersistence(technology);
        await TechnologyModel.create(raw);
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async update(technology: Technology): Promise<void> {
    const TechnologyModel = this.models.Technology;
    try {
      const exists = await this.exists(technology.name);
      if (exists) {
        const raw = TechnologyMap.toPersistence(technology);
        await TechnologyModel.update(raw, { where: { technology_id: technology.technologyId.id.toString() } });
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
}
