module.exports = (sequelize, DataTypes) => {
  const Application = sequelize.define(
    'application',
    {
      application_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      other_info: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      applied_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'candidate',
          key: 'candidate_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      state: {
        type: DataTypes.ENUM(['APPLIED', 'REJECTED', 'ACCEPTED', 'FINISHED', 'HIRED']),
        allowNull: false,
        defaultValue: 'APPLIED',
      },
      job_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'job',
          key: 'job_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      step_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'step',
          key: 'step_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      applied_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'application',
    },
  );

  Application.associate = ({ Candidate, Job, Step }) => {
    Application.belongsTo(Candidate, { foreignKey: 'applied_by' });
    Application.belongsTo(Job, { foreignKey: 'job_id' });
    Application.belongsTo(Step, { foreignKey: 'step_id' });
  };

  return Application;
};
