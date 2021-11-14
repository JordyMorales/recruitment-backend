import { Rate } from '../rate';
import { RateId } from '../rateId';
import { InterviewId } from '../interviewId';

export interface IRateRepo {
  exists(rateId: RateId): Promise<boolean>;
  getRateById(rateId: RateId): Promise<Rate>;
  getAllInterviewRates(interviewId: InterviewId): Promise<Rate[]>;
  save(rate: Rate): Promise<void>;
  update(rate: Rate): Promise<void>;
}
