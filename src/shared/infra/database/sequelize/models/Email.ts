module.exports = (sequelize, DataTypes) => {
  const Email = sequelize.define(
    'email',
    {
      email_id: {
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
      tableName: 'email',
      indexes: [{ unique: true, fields: ['value'] }],
    },
  );

  Email.associate = ({ Candidate }) => {
    Email.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'emails' });
  };

  return Email;
};
