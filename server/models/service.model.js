import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Service = sequelize.define('service', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'services',
  timestamps: true
});

export default Service;
