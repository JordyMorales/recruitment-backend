module.exports = (sequelize, DataTypes) => {
  const CandidateTechnology = sequelize.define(
    'candidate_technology',
    {
      candidate_technology_id: {
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
      technology_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'technology',
          key: 'technology_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'candidate_technology',
    },
  );

  CandidateTechnology.associate = ({ Candidate, Technology }) => {
    CandidateTechnology.belongsTo(Candidate, { foreignKey: 'candidate_id' });
    CandidateTechnology.belongsTo(Technology, { foreignKey: 'technology_id' });
  };

  return CandidateTechnology;
};
