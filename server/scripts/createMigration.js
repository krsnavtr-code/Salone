import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '../migrations');

// Ensure migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Get the database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'salon_management',
  dialect: process.env.DB_DIALECT || 'postgres'
};

// Build the sequelize-cli command
const buildCommand = (name) => {
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  const migrationName = `${timestamp}-${name}`;
  
  // Add environment variables
  const envVars = [
    `DB_HOST=${dbConfig.host}`,
    `DB_PORT=${dbConfig.port}`,
    `DB_USERNAME=${dbConfig.username}`,
    `DB_PASSWORD=${dbConfig.password}`,
    `DB_NAME=${dbConfig.database}`,
    `DB_DIALECT=${dbConfig.dialect}`
  ];

  if (process.env.NODE_ENV === 'production') {
    envVars.push('NODE_ENV=production');
  } else {
    envVars.push('NODE_ENV=development');
  }

  // Build the command
  const command = [
    ...envVars,
    'npx sequelize-cli migration:generate',
    `--name ${migrationName}`,
    `--migrations-path=${migrationsDir}`,
    `--config=${path.join(__dirname, '../config/config.js')}`,
    `--env=${process.env.NODE_ENV || 'development'}`
  ];

  return command.join(' ');
};

// Main function
const createMigration = async () => {
  const name = process.argv[2];
  
  if (!name) {
    console.error('❌ Please provide a name for the migration:');
    console.log('  Usage: node createMigration.js <migration-name>');
    process.exit(1);
  }
  
  console.log(`🚀 Creating migration: ${name}`);
  
  try {
    const command = buildCommand(name);
    console.log(`Running: ${command}`);
    
    const { stdout, stderr } = await execAsync(command);
    
    if (stderr) {
      console.error('❌ Error creating migration:');
      console.error(stderr);
      process.exit(1);
    }
    
    console.log('✅ Migration created successfully!');
    console.log(stdout);
    
    // Get the created migration file
    const files = fs.readdirSync(migrationsDir);
    const migrationFile = files.find(f => f.includes(name) && f.endsWith('.js'));
    
    if (migrationFile) {
      const filePath = path.join(migrationsDir, migrationFile);
      console.log(`📄 Migration file: ${filePath}`);
      
      // Add some basic template to the migration file
      const template = `'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add migration code here
  },

  down: async (queryInterface, Sequelize) => {
    // Add migration rollback code here
  }
};
`;
      
      fs.writeFileSync(filePath, template);
      console.log('📝 Added basic template to migration file');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating migration:');
    console.error(error.message);
    process.exit(1);
  }
};

// Run the script
createMigration();
