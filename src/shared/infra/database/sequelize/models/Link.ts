module.exports = (sequelize, DataTypes) => {
  const Link = sequelize.define(
    'link',
    {
      link_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      value: {
        type: DataTypes.STRING(50),
        allowNull: false,
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
      tableName: 'link',
    },
  );

  Link.associate = ({ Candidate }) => {
    Link.belongsTo(Candidate, { foreignKey: 'candidate_id', as: 'links' });
  };

  return Link;
};
