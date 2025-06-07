import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/user.model.js';
import sequelize from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createAdmin() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');

    // Read admin credentials
    const credentialsPath = path.join(__dirname, 'admin-credentials.json');
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf-8'));

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
      console.log(`🔁 Updated existing admin: ${existingAdmin.email}`);
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
    console.error('❌ Error in admin setup:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createAdmin();
