import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const execAsync = promisify(exec);
const migrationsDir = path.join(__dirname, '../migrations');

// Get the database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'salone',
  dialect: 'mysql',
  logging: false
};

// Build the sequelize-cli command
const buildCommand = (action, migrationName = '') => {
  let command = 'npx sequelize-cli db:migrate';
  
  // Use the environment variables that are already loaded from .env
  // No need to set them in the command for Windows
  const fullCommand = [
    command,
    `--migrations-path=${migrationsDir}`,
    `--config=${path.join(__dirname, '../config/config.js')}`,
    `--env=${process.env.NODE_ENV || 'development'}`
  ];

  if (action === 'up' && migrationName) {
    fullCommand.push(`--name=${migrationName}`);
  } else if (action === 'down') {
    fullCommand.push('--to');
  }

  return fullCommand.join(' ');
};

// Run migrations
const runMigrations = async () => {
  console.log('🚀 Starting database migrations...');
  
  try {
    // Check if database exists, if not create it
    try {
      // Temporarily connect without database name to check/create it
      const tempSequelize = new Sequelize({
        dialect: 'mysql',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || 3306,
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        logging: false
      });

      // Create database if it doesn't exist
      await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
      console.log(`✅ Database ${process.env.DB_NAME} is ready`);
      await tempSequelize.close();
    } catch (dbError) {
      console.error('❌ Error setting up database:', dbError.message);
      process.exit(1);
    }

    // Run all pending migrations
    console.log('🔄 Running migrations...');
    const { stdout, stderr } = await execAsync(buildCommand('up'));
    
    if (stderr && !stderr.includes('No migrations were executed')) {
      console.error('❌ Error running migrations:');
      console.error(stderr);
      process.exit(1);
    }
    
    console.log('✅ Migrations completed successfully!');
    console.log(stdout);
    
    // If we're in development, also run the seeders
    if (process.env.NODE_ENV !== 'production') {
      console.log('🌱 Running seeders...');
      try {
        await execAsync('npx sequelize-cli db:seed:all');
        console.log('✅ Seeders completed successfully!');
      } catch (seedError) {
        console.error('⚠️ Error running seeders (this might be expected if no seeders exist):');
        console.error(seedError.message);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migrations:');
    console.error(error.message);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
  }
};

// Run the migrations
runMigrations();
