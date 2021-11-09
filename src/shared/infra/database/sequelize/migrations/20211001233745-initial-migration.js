const runner = require('../runner');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const CREATE_USER = () =>
      queryInterface.createTable(
        'user',
        {
          user_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          first_name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          middle_name: {
            type: Sequelize.STRING(100),
            allowNull: true,
          },
          last_name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
          },
          phone: {
            type: Sequelize.STRING(50),
            allowNull: true,
          },
          date_of_birth: {
            type: Sequelize.DATEONLY,
            allowNull: true,
          },
          country: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          city: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          address: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          photo_url: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          resume_url: {
            type: Sequelize.STRING(300),
            allowNull: true,
          },
          job_title: {
            type: Sequelize.STRING(150),
            allowNull: true,
          },
          role: {
            type: Sequelize.ENUM(['ADMIN', 'RECRUITER', 'INTERVIEWER', 'EMPLOYEE', 'CANDIDATE']),
            allowNull: false,
            defaultValue: 'CANDIDATE',
          },
          state: {
            type: Sequelize.ENUM(['ACTIVE', 'INACTIVE', 'ARCHIVED', 'REMOVED']),
            allowNull: false,
            defaultValue: 'ACTIVE',
          },
        },
        {
          timestamps: false,
          underscored: true,
          freezeTableName: true,
          tableName: 'user',
          indexes: [{ unique: true, fields: ['email'] }],
        },
      );

    await runner.run([
      () => CREATE_USER(),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return runner.run([
      () => queryInterface.dropTable('user'),
    ]);
  },
};
