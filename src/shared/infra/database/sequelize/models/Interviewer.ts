module.exports = (sequelize, DataTypes) => {
  const Interviewer = sequelize.define(
    'interviewer',
    {
      interviewer_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id',
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
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'interviewer',
    },
  );

  Interviewer.associate = ({ Interview, Rate, User }) => {
    Interviewer.belongsTo(Interview, { foreignKey: 'interview_id' });
    Interviewer.belongsTo(User, { foreignKey: 'user_id' });
    Interviewer.hasMany(Rate, { foreignKey: 'user_id' });
  };

  return Interviewer;
};
