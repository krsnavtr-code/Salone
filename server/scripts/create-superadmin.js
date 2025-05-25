import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createRequire } from 'module';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

require('../config/db.js');

const createSuperAdmin = async () => {
  try {
    // Check if superadmin already exists
    const existingSuperAdmin = await User.findOne({
      where: {
        email: 'superadmin@salone.com'
      }
    });

    if (existingSuperAdmin) {
      console.log('Superadmin account already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('Superadmin@123', 10);

    // Create superadmin user
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@salone.com',
      password_hash: hashedPassword,
      role: 'superadmin',
      phone: '1234567890'
    });

    const credentials = {
      id: superAdmin.id,
      name: superAdmin.name,
      email: superAdmin.email,
      password: 'Superadmin@123', // Only stored temporarily in this file
      role: superAdmin.role,
      created_at: new Date().toISOString()
    };

    console.log('Superadmin account created successfully:', {
      id: credentials.id,
      name: credentials.name,
      email: credentials.email,
      role: credentials.role
    });

    // Save credentials to a file (for admin reference only)
    const fs = require('fs');
    const path = require('path');
    const credentialsPath = path.join(__dirname, '../../admin-credentials.json');
    
    fs.writeFileSync(credentialsPath, JSON.stringify(credentials, null, 2));
    console.log(`\nAdmin credentials have been saved to: ${credentialsPath}`);
    console.log('IMPORTANT: Keep this file secure and do not commit it to version control!');
  } catch (error) {
    console.error('Error creating superadmin:', error);
    process.exit(1);
  }
};

createSuperAdmin();
