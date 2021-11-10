import { Technology } from '../technology';
import { TechnologyId } from '../technologyId';

export interface ITechnologyRepo {
  exists(technology: string): Promise<boolean>;
  getTechnologyById(technologyId: TechnologyId): Promise<Technology>;
  getAllTechnologies(): Promise<Technology[]>;
  save(technology: Technology): Promise<void>;
  update(technology: Technology): Promise<void>;
}
