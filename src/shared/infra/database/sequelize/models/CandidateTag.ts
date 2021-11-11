module.exports = (sequelize, DataTypes) => {
  const CandidateTag = sequelize.define(
    'candidate_tag',
    {
      candidate_tag_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
      tag_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'tag',
          key: 'tag_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'candidate_tag',
    },
  );

  CandidateTag.associate = ({ Candidate, Tag }) => {
    CandidateTag.belongsTo(Candidate, { foreignKey: 'candidate_id' });
    CandidateTag.belongsTo(Tag, { foreignKey: 'tag_id' });
  };

  return CandidateTag;
};
