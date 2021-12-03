import { Process } from './../process';
import { Result } from '../../../../../shared/core/Result';

let process: Process;
let processOrError: Result<Process>;

test('Should be able to create a process', () => {
  processOrError = Process.create({ code: '003', name: 'React engineer' });
  expect(processOrError.isSuccess).toBe(true);
  process = processOrError.getValue();
  expect(process.code).toContain('003');
  expect(process.name).toContain('React engineer');
  expect(process.description).toBeNull();
});
