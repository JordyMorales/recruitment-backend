module.exports = (sequelize, DataTypes) => {
  const Job = sequelize.define(
    'job',
    {
      job_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      date_published: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      vacancies: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      process_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'process',
          key: 'process_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      state: {
        type: DataTypes.ENUM(['DRAFF', 'PUBLISHED', 'CANCELED', 'FINISHED']),
        allowNull: false,
        defaultValue: 'DRAFF',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      created_at: {
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
      tableName: 'job',
    },
  );

  Job.associate = ({ Application, Process, User }) => {
    Job.belongsTo(Process, { foreignKey: 'process_id' });
    Job.belongsTo(User, { foreignKey: 'created_by', as: 'jobCreatedBy' });
    Job.belongsTo(User, { foreignKey: 'updated_by', as: 'jobUpdatedBy' });
    Job.hasMany(Application, { foreignKey: 'job_id' });
  };

  return Job;
};
