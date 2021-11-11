import { injectable } from 'inversify';
import { Tag } from '../../domain/tag';
import { TagId } from '../../domain/tagId';
import { TagMap } from '../mappers/tagMap';
import { ITagRepo } from '../../domain/ports/ITagRepo';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class TagRepo implements ITagRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(tag: string): Promise<boolean> {
    const TagModel = this.models.Tag;
    const tagFound = await TagModel.findOne({
      where: { name: tag },
    });
    return !!tagFound === true;
  }
  async getTagById(tagId: TagId): Promise<Tag> {
    const TagModel = this.models.Tag;
    const tagFound = await TagModel.findByPk(tagId.id.toString());

    if (!!tagFound === false) throw new Error('Tag not found.');

    return TagMap.toDomain(tagFound);
  }
  async getAllTags(): Promise<Tag[]> {
    const TagModel = this.models.Tag;
    const tags = await TagModel.findAll();
    return tags.map((tag) => TagMap.toDomain(tag));
  }
  async save(tag: Tag): Promise<void> {
    const TagModel = this.models.Tag;
    try {
      const exists = await this.exists(tag.name);
      if (!exists) {
        const raw = TagMap.toPersistence(tag);
        await TagModel.create(raw);
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async update(tag: Tag): Promise<void> {
    const TagModel = this.models.Tag;
    try {
      const exists = await this.exists(tag.name);
      if (exists) {
        const raw = TagMap.toPersistence(tag);
        await TagModel.update(raw, { where: { tag_id: tag.tagId.id.toString() } });
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
}
