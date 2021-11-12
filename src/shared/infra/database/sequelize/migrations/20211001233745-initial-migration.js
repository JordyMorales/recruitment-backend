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
    const CREATE_CANDIDATE = () =>
      queryInterface.createTable(
        'candidate',
        {
          candidate_id: {
            type: Sequelize.UUID,
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
            type: Sequelize.STRING(150),
            allowNull: true,
          },
          city: {
            type: Sequelize.STRING(100),
            allowNull: true,
          },
          country: {
            type: Sequelize.STRING(100),
            allowNull: true,
          },
          english_level: {
            type: Sequelize.STRING(15),
            allowNull: true,
          },
          engineering_level: {
            type: Sequelize.FLOAT,
            allowNull: true,
          },
          salary_pretension: {
            type: Sequelize.STRING(150),
            allowNull: true,
          },
          contract_preference: {
            type: Sequelize.STRING(150),
            allowNull: true,
          },
          job_title: {
            type: Sequelize.STRING(150),
            allowNull: true,
          },
          company: {
            type: Sequelize.STRING(150),
            allowNull: true,
          },
          resume_url: {
            type: Sequelize.STRING(300),
            allowNull: true,
          },
          seniority: {
            type: Sequelize.STRING(100),
            allowNull: true,
          },
          availability: {
            type: Sequelize.STRING(150),
            allowNull: true,
          },
          referral_by: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'user',
              key: 'user_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          created_by: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'user',
              key: 'user_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          updated_by: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'user',
              key: 'user_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        {
          timestamps: false,
          underscored: true,
          tableName: 'candidate',
        },
      );

    const CREATE_TAG = () =>
      queryInterface.createTable(
        'tag',
        {
          tag_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
          },
          color: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
        },
        {
          timestamps: false,
          underscored: true,
          freezeTableName: true,
          tableName: 'tag',
          indexes: [{ unique: true, fields: ['name'] }],
        },
      );

    const CREATE_CANDIDATE_TAG = () =>
      queryInterface.createTable(
        'candidate_tag',
        {
          candidate_tag_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          candidate_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'candidate',
              key: 'candidate_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          tag_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'tag',
              key: 'tag_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
        },
        {
          timestamps: false,
          underscored: true,
          tableName: 'candidate_tag',
        },
      );

    const CREATE_LINK = () =>
      queryInterface.createTable(
        'link',
        {
          link_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          value: {
            type: Sequelize.STRING(50),
            allowNull: false,
          },
          candidate_id: {
            type: Sequelize.UUID,
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

    const CREATE_PHONE = () =>
      queryInterface.createTable(
        'phone',
        {
          phone_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          value: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
          },
          candidate_id: {
            type: Sequelize.UUID,
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
          freezeTableName: true,
          tableName: 'phone',
          indexes: [{ unique: true, fields: ['value'] }],
        },
      );

    const CREATE_EMAIL = () =>
      queryInterface.createTable(
        'email',
        {
          email_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          value: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
          },
          candidate_id: {
            type: Sequelize.UUID,
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

    const CREATE_TECHNOLOGY = () =>
      queryInterface.createTable(
        'technology',
        {
          technology_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false,
            unique: true,
          },
          is_active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
        },
        {
          timestamps: false,
          underscored: true,
          tableName: 'technology',
          indexes: [{ unique: true, fields: ['name'] }],
        },
      );

    const CREATE_CANDIDATE_TECHNOLOGY = () =>
      queryInterface.createTable(
        'candidate_technology',
        {
          candidate_technology_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          candidate_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'candidate',
              key: 'candidate_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          technology_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'technology',
              key: 'technology_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
        },
        {
          timestamps: false,
          underscored: true,
          tableName: 'candidate_technology',
        },
      );

    const CREATE_COMMENT = () =>
      queryInterface.createTable(
        'comment',
        {
          comment_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          comment: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          candidate_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'candidate',
              key: 'candidate_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          parent_comment_id: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'comment',
              key: 'comment_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          commented_by: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'user',
              key: 'user_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          commented_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
        },
        {
          timestamps: false,
          underscored: true,
          tableName: 'comment',
        },
      );

    const CREATE_PROCESS = () =>
      queryInterface.createTable(
        'process',
        {
          process_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          code: {
            type: Sequelize.STRING(10),
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING(200),
            allowNull: true,
          },
        },
        {
          timestamps: false,
          underscored: true,
          tableName: 'process',
        },
      );

    const CREATE_STEP = () =>
      queryInterface.createTable(
        'step',
        {
          step_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          order: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING(200),
            allowNull: true,
          },
          process_id: {
            type: Sequelize.UUID,
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

    const CREATE_JOB = () =>
      queryInterface.createTable(
        'job',
        {
          job_id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING(200),
            allowNull: true,
          },
          date_published: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          start_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          vacancies: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          process_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'process',
              key: 'process_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          state: {
            type: Sequelize.ENUM(['DRAFF', 'PUBLISHED', 'CANCELED', 'FINISHED']),
            allowNull: false,
            defaultValue: 'DRAFF',
          },
          created_by: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'user',
              key: 'user_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          updated_by: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'user',
              key: 'user_id',
            },
            onDelete: 'cascade',
            onUpdate: 'cascade',
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        },
        {
          timestamps: false,
          underscored: true,
          tableName: 'job',
        },
      );

    await runner.run([
      () => CREATE_USER(),
      () => CREATE_CANDIDATE(),
      () => CREATE_TAG(),
      () => CREATE_CANDIDATE_TAG(),
      () => CREATE_LINK(),
      () => CREATE_PHONE(),
      () => CREATE_EMAIL(),
      () => CREATE_TECHNOLOGY(),
      () => CREATE_CANDIDATE_TECHNOLOGY(),
      () => CREATE_COMMENT(),
      () => CREATE_PROCESS(),
      () => CREATE_STEP(),
      () => CREATE_JOB(),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return runner.run([
      () => queryInterface.dropTable('user'),
      () => queryInterface.dropTable('candidate'),
      () => queryInterface.dropTable('tag'),
      () => queryInterface.dropTable('candidate_tag'),
      () => queryInterface.dropTable('link'),
      () => queryInterface.dropTable('phone'),
      () => queryInterface.dropTable('email'),
      () => queryInterface.dropTable('technology'),
      () => queryInterface.dropTable('candidate_technology'),
      () => queryInterface.dropTable('comment'),
      () => queryInterface.dropTable('process'),
      () => queryInterface.dropTable('step'),
      () => queryInterface.dropTable('job'),
    ]);
  },
};
