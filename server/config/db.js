import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import config from './config.js';

// Load environment variables
dotenv.config({ path: '.env' });

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// Log database configuration (without sensitive data)
console.log(`\n🔧 Database Configuration (${env}):`);
console.log('----------------------------------------');
console.log(`Host: ${dbConfig.host}`);
console.log(`Port: ${dbConfig.port}`);
console.log(`Database: ${dbConfig.database}`);
console.log(`Dialect: ${dbConfig.dialect}`);
console.log('----------------------------------------\n');

// Initialize Sequelize with the configuration
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: env === 'development' ? console.log : false,
    dialectOptions: env === 'production' 
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        } 
      : {},
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
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Only sync in development
    if (env === 'development') {
      await sequelize.sync({ alter: true });
      console.log('🔄 Database synchronized');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    console.error('Error details:', {
      name: error.name,
      code: error.parent?.code,
      sqlState: error.parent?.sqlState,
      sqlMessage: error.parent?.sqlMessage,
      sql: error.parent?.sql?.substring(0, 200) + '...'
    });
    
    // Exit with error code
    process.exit(1);
  }
};

// Export the Sequelize instance and test connection
export { sequelize, testConnection };
export default sequelize;
