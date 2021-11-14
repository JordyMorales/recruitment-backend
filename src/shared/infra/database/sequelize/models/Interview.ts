module.exports = (sequelize, DataTypes) => {
  const Interview = sequelize.define(
    'interview',
    {
      interview_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      topic: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      application_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'application',
          key: 'application_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      scheduled_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      triggered_at: {
        type: DataTypes.DATE,
        allowNull: false,
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'interview',
    },
  );

  Interview.associate = ({ Application, Interviewer, Step }) => {
    Interview.belongsTo(Application, { foreignKey: 'application_id' });
    Interview.belongsTo(Step, { foreignKey: 'step_id' });
    Interview.hasMany(Interviewer, { foreignKey: 'interview_id' });
  };

  return Interview;
};
