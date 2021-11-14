import { injectable } from 'inversify';
import { InterviewId } from '../../domain/interviewId';
import { Rate } from '../../domain/rate';
import { RateId } from '../../domain/rateId';
import { RateMap } from '../mappers/rateMap';

@injectable()
export class RateRepo implements IRateRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async exists(rateId: RateId): Promise<boolean> {
    const RateModel = this.models.Rate;
    const rateFound = await RateModel.findByPk(rateId.id.toString());
    return !!rateFound === true;
  }
  async getRateById(rateId: RateId): Promise<Rate> {
    const RateModel = this.models.Rate;
    const rateFound = await RateModel.findByPk(rateId.id.toString());

    if (!!rateFound === false) throw new Error('Rate not found.');

    return RateMap.toDomain(rateFound);
  }
  async getAllInterviewRates(interviewId: InterviewId): Promise<Rate[]> {
    const RateModel = this.models.Rate;
    const rates = await RateModel.findAll({
      where: { interview_id: interviewId.id.toString() },
    });
    return rates.map((interview) => RateMap.toDomain(interview));
  }
  async save(rate: Rate): Promise<void> {
    const RateModel = this.models.Rate;
    try {
      const exists = await this.exists(rate.rateId);
      if (!exists) {
        const raw = RateMap.toPersistence(rate);
        await RateModel.create(raw);
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async update(rate: Rate): Promise<void> {
    const RateModel = this.models.Rate;
    try {
      const exists = await this.exists(rate.rateId);
      if (exists) {
        const raw = RateMap.toPersistence(rate);
        await RateModel.update(raw, { where: { rate_id: rate.rateId.id.toString() } });
      }
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
}
