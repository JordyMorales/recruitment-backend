module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'comment',
    {
      comment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'candidate',
          key: 'candidate_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      parent_comment_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'comment',
          key: 'comment_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      commented_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      commented_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'comment',
    },
  );

  Comment.associate = ({ Candidate, User }) => {
    Comment.belongsTo(Candidate, { foreignKey: 'candidate_id' });
    Comment.belongsTo(User, { foreignKey: 'commented_by' });
  };

  return Comment;
};
