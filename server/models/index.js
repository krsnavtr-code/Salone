import { Sequelize } from 'sequelize';
import config from '../config/config.js';

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Import all models
import User from './user.model.js';
import Service from './service.model.js';
import ServiceCategory from './serviceCategory.model.js';
import Appointment from './appointment.model.js';
import StaffService from './staffService.model.js';
import WorkingHours from './workingHours.model.js';
import TimeOff from './timeOff.model.js';

// Initialize models
const db = {
  User: User.init(sequelize, Sequelize),
  Service: Service.init(sequelize, Sequelize),
  ServiceCategory: ServiceCategory.init(sequelize, Sequelize),
  Appointment: Appointment.init(sequelize, Sequelize),
  StaffService: StaffService.init(sequelize, Sequelize),
  WorkingHours: WorkingHours.init(sequelize, Sequelize),
  TimeOff: TimeOff.init(sequelize, Sequelize),
  sequelize,
  Sequelize
};

// Set up associations
Object.values(db)
  .filter(model => typeof model.associate === 'function')
  .forEach(model => model.associate(db));

// Export models and sequelize instance
export {
  User,
  Service,
  ServiceCategory,
  Appointment,
  StaffService,
  WorkingHours,
  TimeOff,
  sequelize,
  Sequelize
};

export default db;
