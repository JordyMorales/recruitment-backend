const pgtools = require('pgtools');
require('dotenv').config();

const {
  RECRUITMENT_DB_USER,
  RECRUITMENT_DB_PASS,
  RECRUITMENT_DB_HOST,
  RECRUITMENT_DEV_DB_NAME,
  RECRUITMENT_TEST_DB_NAME,
  RECRUITMENT_PROD_DB_NAME,
  NODE_ENV,
} = process.env;

const dbName =
  NODE_ENV === 'production'
    ? RECRUITMENT_PROD_DB_NAME
    : NODE_ENV === 'development'
    ? RECRUITMENT_DEV_DB_NAME
    : RECRUITMENT_TEST_DB_NAME;

const config = {
  user: RECRUITMENT_DB_USER,
  host: RECRUITMENT_DB_HOST,
  port: 5432,
  password: RECRUITMENT_DB_PASS,
};

pgtools.createdb(config, dbName, function (err, res) {
  if (err && err.name == 'duplicate_database') {
    console.error(`[DB] database ${dbName} already exists.`);
    process.exit(0);
  }
  console.log(`[DB] ${dbName} database was created successfully.`);
  process.exit(0);
});
