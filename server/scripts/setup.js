#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import sequelize from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const ADMIN_CREDENTIALS_PATH = path.join(process.cwd(), 'server', 'admin-credentials.json');
const ENV_EXAMPLE_PATH = path.join(process.cwd(), '.env.example');
const ENV_PATH = path.join(process.cwd(), '.env');

async function runCommand(command, cwd = process.cwd()) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit', cwd });
    return true;
  } catch (error) {
    console.error(`Error executing command: ${command}`, error);
    return false;
  }
}

async function setupEnvironment() {
  console.log('🚀 Setting up the Salon Management System...\n');

  // Check if .env exists, if not, create it from .env.example
  if (!fs.existsSync(ENV_PATH)) {
    console.log('📄 Creating .env file from .env.example...');
    try {
      const envExample = await readFile(ENV_EXAMPLE_PATH, 'utf8');
      await writeFile(ENV_PATH, envExample);
      console.log('✅ Created .env file');
    } catch (error) {
      console.error('❌ Failed to create .env file:', error.message);
      process.exit(1);
    }
  }

  // Load environment variables again after creating .env
  dotenv.config({ path: ENV_PATH, override: true });
}

async function installDependencies() {
  console.log('\n📦 Installing dependencies...');
  
  // Install server dependencies
  console.log('\n🔧 Installing server dependencies...');
  await runCommand('npm install', path.join(process.cwd(), 'server'));
  
  // Install client dependencies
  console.log('\n💅 Installing client dependencies...');
  await runCommand('npm install', path.join(process.cwd(), 'client'));
  
  console.log('✅ Dependencies installed successfully');
}

async function setupDatabase() {
  console.log('\n💾 Setting up database...');
  
  try {
    // Authenticate with the database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models
    console.log('🔄 Syncing database models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synced');
    
    // Create admin user
    await createAdminUser();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

async function createAdminUser() {
  console.log('\n👤 Setting up admin user...');
  
  try {
    // Check if admin credentials file exists
    if (!fs.existsSync(ADMIN_CREDENTIALS_PATH)) {
      throw new Error('Admin credentials file not found. Please create server/admin-credentials.json');
    }
    
    const credentials = JSON.parse(await readFile(ADMIN_CREDENTIALS_PATH, 'utf8'));
    
    if (!credentials.email || !credentials.password) {
      throw new Error('Admin credentials file is missing required fields');
    }
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { email: credentials.email } });
    
    if (existingAdmin) {
      // Update existing admin
      existingAdmin.role = credentials.role || 'superadmin';
      existingAdmin.name = credentials.name || 'Super Admin';
      
      // Only update password if it's different
      const isPasswordSame = await bcrypt.compare(credentials.password, existingAdmin.password_hash);
      if (!isPasswordSame) {
        existingAdmin.password_hash = await bcrypt.hash(credentials.password, 12);
      }
      
      await existingAdmin.save();
      console.log(`✅ Updated existing admin: ${existingAdmin.email}`);
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(credentials.password, 12);
      const admin = await User.create({
        name: credentials.name || 'Super Admin',
        email: credentials.email,
        password_hash: hashedPassword,
        role: credentials.role || 'superadmin',
        email_verified: true
      });
      console.log(`✅ Created new admin: ${admin.email}`);
    }
  } catch (error) {
    console.error('❌ Failed to setup admin user:', error.message);
    process.exit(1);
  }
}

async function startServers() {
  console.log('\n🚀 Starting development servers...');
  console.log('   - Frontend: http://localhost:3000');
  console.log('   - Backend API: http://localhost:5000');
  console.log('\n👉 Use Ctrl+C to stop both servers');
  
  // Start both servers in parallel
  try {
    // Run client and server in parallel
    const { default: concurrently } = await import('concurrently');
    
    await concurrently([
      { command: 'npm run dev', cwd: 'client', name: 'client', prefixColor: 'blue' },
      { command: 'npm run dev', cwd: 'server', name: 'server', prefixColor: 'green' }
    ], {
      prefix: 'name',
      killOthers: ['failure', 'success'],
      restartTries: 3,
      cwd: process.cwd(),
    });
  } catch (error) {
    console.error('❌ Failed to start servers:', error.message);
    process.exit(1);
  }
}

async function main() {
  try {
    await setupEnvironment();
    await installDependencies();
    await setupDatabase();
    await startServers();
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Run the setup
main();
