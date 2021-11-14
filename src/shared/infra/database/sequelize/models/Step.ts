module.exports = (sequelize, DataTypes) => {
  const Step = sequelize.define(
    'step',
    {
      step_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      order: {
        type: DataTypes.INTEGER,
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
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'step',
    },
  );

  Step.associate = ({ Application, Interview, Process }) => {
    Step.belongsTo(Process, { foreignKey: 'process_id' });
    Step.hasMany(Application, { foreignKey: 'step_id' });
    Step.hasMany(Interview, { foreignKey: 'step_id' });
  };

  return Step;
};
