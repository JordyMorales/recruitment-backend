import { TagDTO } from '../../domain/dtos/tagDTO';
import { Tag } from '../../domain/tag';
import { Mapper } from '../../../../../shared/infra/Mapper';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

export class TagMap implements Mapper<Tag> {
  public static toDTO(tag: Tag): TagDTO {
    return {
      tagId: tag.tagId.id.toString(),
      name: tag.name.toString(),
      color: tag.color.toString(),
    };
  }

  public static toDomain(raw: any): Tag {
    const tagOrError = Tag.create(
      {
        name: raw.name,
        color: raw.color,
      },
      new UniqueEntityID(raw.tag_id),
    );

    tagOrError.isFailure ? console.log(tagOrError.error) : '';

    return tagOrError.isSuccess ? tagOrError.getValue() : null;
  }

  public static toPersistence(tag: Tag): any {
    return {
      tag_id: tag.tagId.id.toString(),
      name: tag.name.toString(),
      color: tag.color.toString(),
    };
  }
}
