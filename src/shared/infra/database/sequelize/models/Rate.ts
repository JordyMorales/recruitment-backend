module.exports = (sequelize, DataTypes) => {
  const Rate = sequelize.define(
    'rate',
    {
      rate_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      pros: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cons: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rated_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'interviewer',
          key: 'interviewer_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      interview_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'interview',
          key: 'interview_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      rated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'rate',
    },
  );

  Rate.associate = ({ Interview, Interviewer }) => {
    Rate.belongsTo(Interview, { foreignKey: 'interview_id' });
    Rate.belongsTo(Interviewer, { foreignKey: 'rated_by' });
  };

  return Rate;
};
