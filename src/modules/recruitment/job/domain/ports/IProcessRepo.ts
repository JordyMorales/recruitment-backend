import { Process } from '../process';
import { ProcessId } from '../processId';

export interface IProcessRepo {
  exists(code: string): Promise<boolean>;
  getProcessById(processId: ProcessId): Promise<Process>;
  save(process: Process): Promise<void>;
  update(process: Process): Promise<void>;
}
