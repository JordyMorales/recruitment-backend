require('dotenv').config();
const Sequelize = require('sequelize');

const {
  RECRUITMENT_DB_USER,
  RECRUITMENT_DB_PASS,
  RECRUITMENT_DB_HOST,
  RECRUITMENT_DEV_DB_NAME,
  RECRUITMENT_TEST_DB_NAME,
  RECRUITMENT_PROD_DB_NAME,
  NODE_ENV,
  RECRUITMENT_IS_PRODUCTION,
} = process.env;

const databaseCredentials = {
  development: {
    username: RECRUITMENT_DB_USER,
    password: RECRUITMENT_DB_PASS,
    database: RECRUITMENT_DEV_DB_NAME,
    host: RECRUITMENT_DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: RECRUITMENT_DB_USER,
    password: RECRUITMENT_DB_PASS,
    database: RECRUITMENT_TEST_DB_NAME,
    host: RECRUITMENT_DB_HOST,
    dialect: 'postgres',
  },
  production: {
    username: RECRUITMENT_DB_USER,
    password: RECRUITMENT_DB_PASS,
    database: RECRUITMENT_PROD_DB_NAME,
    host: RECRUITMENT_DB_HOST,
    dialect: 'postgres',
  },
};

const { username, password, database, host, dialect } = databaseCredentials[NODE_ENV];

module.exports = databaseCredentials;

const mode = RECRUITMENT_IS_PRODUCTION === 'true' ? 'prod' : 'dev';

console.log(`[DB] connecting to the database in ${mode} mode.`);

module.exports.connection = new Sequelize(database, username, password, {
  host,
  dialect,
  port: 5432,
  dialectOptions: {
    multipleStatements: true,
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});
