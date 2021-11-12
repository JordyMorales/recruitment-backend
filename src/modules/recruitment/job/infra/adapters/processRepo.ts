import { injectable } from 'inversify';
import { Process } from '../../domain/process';
import { ProcessId } from '../../domain/processId';
import { IProcessRepo } from '../../domain/ports/IProcessRepo';
import { ProcessMap } from '../mappers/processMap';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class ProcessRepo implements IProcessRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(code: string): Promise<boolean> {
    const ProcessModel = this.models.Process;
    const processFound = await ProcessModel.findOne({
      where: { code },
    });
    return !!processFound === true;
  }
  async getProcessById(processId: ProcessId): Promise<Process> {
    const ProcessModel = this.models.Process;
    const processFound = await ProcessModel.findByPk(processId.id.toString());

    if (!!processFound === false) throw new Error('Process not found.');

    return ProcessMap.toDomain(processFound);
  }
  async save(process: Process): Promise<void> {
    const ProcessModel = this.models.Process;
    try {
      const exists = await this.exists(process.code);
      if (!exists) {
        const raw = ProcessMap.toPersistence(process);
        await ProcessModel.create(raw);
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
  async update(process: Process): Promise<void> {
    const ProcessModel = this.models.Process;
    try {
      const processFound = await this.getProcessById(process.processId);
      if (!!processFound === true) {
        const raw = ProcessMap.toPersistence(process);
        await ProcessModel.update(raw, {
          where: { process_id: process.processId.id.toString() },
        });
      }
    } catch (error) {
      throw new Error(error.toString());
    }
  }
}
