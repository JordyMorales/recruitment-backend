module.exports = (sequelize, DataTypes) => {
  const Candidate = sequelize.define(
    'candidate',
    {
      candidate_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      address: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      english_level: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      engineering_level: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      salary_pretension: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      contract_preference: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      job_title: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      company: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      resume_url: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      seniority: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      availability: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      referral: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'user',
          key: 'user_id',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'candidate',
    },
  );

  Candidate.associate = ({ User, Email, Phone, Link, Tag, Technology }) => {
    Candidate.belongsTo(User, { foreignKey: 'candidate_id' });
    Candidate.hasMany(Email, { foreignKey: 'candidate_id' });
    Candidate.hasMany(Phone, { foreignKey: 'candidate_id' });
    Candidate.hasMany(Link, { foreignKey: 'candidate_id' });
    Candidate.belongsToMany(Tag, { through: 'candidate_tag', foreignKey: 'candidate_id' });
    Candidate.belongsToMany(Technology, { through: 'candidate_technology', foreignKey: 'candidate_id' });
  };

  return Candidate;
};
