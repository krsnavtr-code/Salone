import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../.env' });

// Log database configuration
console.log('Database configuration:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT
});

// MySQL configuration
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  dialect: 'mysql',
  logging: console.log,
  define: {
    timestamps: true,
    underscored: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test database connection and sync
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    console.error('Database configuration:', {
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_NAME: process.env.DB_NAME,
      DB_PORT: process.env.DB_PORT
    });
    process.exit(1);
  });

export default sequelize;
