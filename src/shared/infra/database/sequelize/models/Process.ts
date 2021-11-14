module.exports = (sequelize, DataTypes) => {
  const Process = sequelize.define(
    'process',
    {
      process_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'process',
    },
  );

  Process.associate = ({ Job, Step }) => {
    Process.hasMany(Step, { foreignKey: 'process_id' });
    Process.hasMany(Job, { foreignKey: 'process_id' });
  };

  return Process;
};
