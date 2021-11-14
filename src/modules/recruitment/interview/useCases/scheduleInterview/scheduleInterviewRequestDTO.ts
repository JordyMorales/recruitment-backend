export interface ScheduleInterviewRequestDTO {
  interviewId?: string;
  topic: string;
  description?: string;
  applicationId: string;
  scheduledAt: Date;
  duration: number;
  triggeredAt?: Date;
  stepId: string;
}
