export interface RateDTO {
  rateId?: string;
  note: string;
  rate: number;
  pros: string;
  cons: string;
  ratedAt?: Date;
  ratedBy?: any;
  interviewId: string;
}
