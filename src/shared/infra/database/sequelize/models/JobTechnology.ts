module.exports = (sequelize, DataTypes) => {
  const JobTechnology = sequelize.define(
    'job_technology',
    {
      job_technology_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
      tableName: 'job_technology',
    },
  );

  JobTechnology.associate = ({ Job, Technology }) => {
    JobTechnology.belongsTo(Job, { foreignKey: 'job_id' });
    JobTechnology.belongsTo(Technology, { foreignKey: 'technology_id' });
  };

  return JobTechnology;
};
