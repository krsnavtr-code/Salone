import dotenv from 'dotenv';
dotenv.config();

const commonConfig = {
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'salone',
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 3306,
  dialect: 'mysql',
  dialectOptions: {
    decimalNumbers: true,
    supportBigNumbers: true,
    bigNumberStrings: false,
    dateStrings: true,
    typeCast: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  timezone: '+05:30'
};

const config = {
  development: {
    ...commonConfig,
    logging: console.log
  },
  test: {
    ...commonConfig,
    database: process.env.DB_TEST_NAME || 'salone_test',
    logging: false
  },
  production: {
    ...commonConfig,
    logging: false,
    pool: {
      ...commonConfig.pool,
      max: 20,
      min: 5
    },
    dialectOptions: {
      ...commonConfig.dialectOptions,
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
};

export default config;
