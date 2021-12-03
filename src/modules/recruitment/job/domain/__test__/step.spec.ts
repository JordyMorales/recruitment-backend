import { Step } from './../step';
import { Result } from '../../../../../shared/core/Result';

let step: Step;
let stepOrError: Result<Step>;

test('Should be able to create a step', () => {
  stepOrError = Step.create({ order: 0, name: 'Initial' });
  expect(stepOrError.isSuccess).toBe(true);
  step = stepOrError.getValue();
  expect(step.order).toBe(0);
  expect(step.name).toContain('Initial');
  expect(step.description).toBeNull();
});
