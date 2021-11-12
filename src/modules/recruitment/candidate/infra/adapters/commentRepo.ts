import { injectable } from 'inversify';
import { Comment } from '../../domain/comment';
import { CandidateId } from '../../domain/candidateId';
import { ICommentRepo } from '../../domain/ports/ICommentRepo';
import { CommentMap } from '../mappers/commentMap';
import models from '../../../../../shared/infra/database/sequelize/models';

@injectable()
export class commentRepo implements ICommentRepo {
  private models: any;
  constructor() {
    this.models = models;
  }
  async getCandidateComments(candidateId: CandidateId): Promise<Comment[]> {
    const CommentModel = this.models.Comment;
    const comments = await CommentModel.findAll({
      where: { candidate_id: candidateId.id.toString() },
      include: [
        {
          model: this.models.User,
          attributes: ['user_id', 'first_name', 'last_name', 'email', 'photo_url', 'state', 'role'],
        },
      ],
    });
    return comments.map((comment) => CommentMap.toDomain(comment));
  }
  async save(comment: Comment): Promise<void> {
    const CommentModel = this.models.Comment;
    try {
      const raw = CommentMap.toPersistence(comment);
      await CommentModel.create(raw);
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async update(comment: Comment): Promise<void> {
    const CommentModel = this.models.Comment;
    try {
      const raw = CommentMap.toPersistence(comment);
      await CommentModel.update(raw, { where: { comment_id: comment.commentId.id.toString() } });
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
  async delete(comment: Comment): Promise<void> {
    const CommentModel = this.models.Comment;
    return CommentModel.destroy({ where: { comment_id: comment.commentId.id.toString() } });
  }
}
