import { Tag } from '../tag';
import { TagId } from '../tagId';

export interface ITagRepo {
  exists(tag: string): Promise<boolean>;
  getTagById(tagId: TagId): Promise<Tag>;
  getAllTags(): Promise<Tag[]>;
  save(tag: Tag): Promise<void>;
  update(tag: Tag): Promise<void>;
}
