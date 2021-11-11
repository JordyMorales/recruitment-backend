module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'tag',
    {
      tag_id: {
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
      color: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
      tableName: 'tag',
      indexes: [{ unique: true, fields: ['name'] }],
    },
  );

  Tag.associate = ({ Candidate }) => {
    Tag.belongsToMany(Candidate, { through: 'candidate_tag', foreignKey: 'tag_id' });
  };

  return Tag;
};
