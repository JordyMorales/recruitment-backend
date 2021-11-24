module.exports = (sequelize, DataTypes) => {
  const Technology = sequelize.define(
    'technology',
    {
      technology_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'technology',
      indexes: [{ unique: true, fields: ['name'] }],
    },
  );

  Technology.associate = ({ Candidate, Job }) => {
    Technology.belongsToMany(Candidate, { through: 'candidate_technology', foreignKey: 'technology_id' });
    Technology.belongsToMany(Job, { through: 'job_technology', foreignKey: 'technology_id' });
  };

  return Technology;
};
