export interface CommentDTO {
  commentId?: string;
  comment: string;
  candidateId: string;
  parentCommentId?: string;
  commentedBy?: any;
  commentedAt?: Date;
}
