export interface UpdateInterviewRequestDTO {
  interviewId?: string;
  topic: string;
  description?: string;
  scheduledAt: Date;
  duration: number;
  triggeredAt?: Date;
}
