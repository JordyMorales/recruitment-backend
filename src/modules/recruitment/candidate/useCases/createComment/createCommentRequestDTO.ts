export interface CreateCommentRequestDTO {
  comment: string;
  candidateId: string;
  parentCommentId?: string;
  commentedBy: any;
  commentedAt?: Date;
}
