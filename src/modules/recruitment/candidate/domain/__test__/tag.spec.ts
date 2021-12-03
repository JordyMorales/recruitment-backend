import { Tag } from './../tag';
import { Result } from '../../../../../shared/core/Result';

let tag: Tag;
let tagOrError: Result<Tag>;

test('Should be able to create a tag', () => {
  tagOrError = Tag.create({ name: 'Direct contact', color: '#FF5733' });
  expect(tagOrError.isSuccess).toBe(true);
  tag = tagOrError.getValue();
  expect(tag.name).toBe('Direct contact');
});

test('Should assign true by default to the isActive property', () => {
  tagOrError = Tag.create({ name: 'Direct contact', color: '#FF5733' });
  expect(tagOrError.isSuccess).toBe(true);
  tag = tagOrError.getValue();
  expect(tag.isActive).toBe(true);
});
