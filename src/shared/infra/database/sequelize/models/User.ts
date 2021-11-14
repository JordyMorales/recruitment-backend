module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      middle_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      photo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      resume_url: {
        type: DataTypes.STRING(300),
        allowNull: true,
      },
      job_title: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE', 'CANDIDATE']),
        allowNull: false,
        defaultValue: 'CANDIDATE',
      },
      state: {
        type: DataTypes.ENUM(['ACTIVE', 'INACTIVE', 'ARCHIVED', 'REMOVED']),
        allowNull: false,
        defaultValue: 'ACTIVE',
      },
    },
    {
      timestamps: false,
      underscored: true,
      tableName: 'user',
      indexes: [{ unique: true, fields: ['email'] }],
    },
  );

  User.associate = ({ Candidate, Comment, Interviewer, Job }) => {
    User.hasOne(Candidate, { foreignKey: 'candidate_id', as: 'user' });
    User.hasMany(Candidate, { foreignKey: 'referral_by', as: 'referralBy' });
    User.hasMany(Candidate, { foreignKey: 'created_by', as: 'createdBy' });
    User.hasMany(Candidate, { foreignKey: 'updated_by', as: 'updatedBy' });
    User.hasMany(Comment, { foreignKey: 'commented_by' });

    User.hasMany(Job, { foreignKey: 'created_by', as: 'jobCreatedBy' });
    User.hasMany(Job, { foreignKey: 'updated_by', as: 'jobUpdatedBy' });
    User.hasMany(Interviewer, { foreignKey: 'user_id' });
  };

  return User;
};
