import { Technology } from './../technology';
import { Result } from '../../../../../shared/core/Result';

let technology: Technology;
let technologyOrError: Result<Technology>;

test('Should be able to create a technology', () => {
  technologyOrError = Technology.create({ name: 'React JS', isActive: true });
  expect(technologyOrError.isSuccess).toBe(true);
  technology = technologyOrError.getValue();
  expect(technology.name).toContain('React JS');
});

test('Should assign true by default to the isActive property', () => {
  technologyOrError = Technology.create({ name: 'React JS' });
  expect(technologyOrError.isSuccess).toBe(true);
  technology = technologyOrError.getValue();
  expect(technology.isActive).toBe(true);
});
