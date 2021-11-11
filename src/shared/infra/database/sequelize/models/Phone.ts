module.exports = (sequelize, DataTypes) => {
  const Phone = sequelize.define(
    'phone',
    {
      phone_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      value: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
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
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'phone',
      indexes: [{ unique: true, fields: ['value'] }],
    },
  );

  Phone.associate = ({Candidate}) => {
    Phone.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'phones' });
  };

  return Phone;
};
