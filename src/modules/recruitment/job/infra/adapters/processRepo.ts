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
  async getAllProcesses(): Promise<Process[]> {
    const ProcessModel = this.models.Process;
    const processes = await ProcessModel.findAll({
      include: [{ model: this.models.Step, order: ['order', 'DESC'] }],
    });
    return processes.map((process) => ProcessMap.toDomain(process));
  }
  async getProcessById(processId: ProcessId): Promise<Process> {
    const ProcessModel = this.models.Process;
    const processFound = await ProcessModel.findByPk(processId.id.toString(), {
      include: [{ model: this.models.Step }],
      order: [[this.models.Step, 'order', 'ASC']],
    });

    if (!!processFound === false) return null;

    return ProcessMap.toDomain(processFound);
  }
  async save(process: Process): Promise<void> {
    const ProcessModel = this.models.Process;
    const transaction = await models['sequelize'].transaction();
    try {
      const raw = ProcessMap.toPersistence(process);
      await ProcessModel.create(
        raw,
        {
          include: [{ model: this.models.Step }],
        },
        transaction,
      );
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw new Error(error.toString());
    }
  }
  async update(process: Process): Promise<void> {
    const ProcessModel = this.models.Process;
    const transaction = await models['sequelize'].transaction();
    try {
      const raw = ProcessMap.toPersistence(process);
      const processInstance = await ProcessModel.findByPk(process.processId.id.toString());
      await processInstance.update(raw, { transaction });
      await transaction.commit();
    } catch (error) {
      if (transaction) await transaction.rollback();
      throw new Error(error.toString());
    }
  }
}
