import { Sequelize } from 'sequelize';
import fs from 'fs';

// SQLite configuration
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// Create database file if it doesn't exist
if (!fs.existsSync('./database.sqlite')) {
  fs.writeFileSync('./database.sqlite', '');
  console.log('Created SQLite database file');
}

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connection established successfully');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1); // Exit if database connection fails
  });

export default sequelize;
