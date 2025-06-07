import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const StaffService = sequelize.define('StaffService', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  price_override: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: {
        args: [0],
        msg: 'Price override cannot be negative'
      },
      isDecimal: {
        msg: 'Price must be a valid decimal number'
      }
    }
  },
  duration_override: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: true,
    validate: {
      min: {
        args: [1],
        msg: 'Duration override must be at least 1 minute'
      },
      max: {
        args: [1440],
        msg: 'Duration override cannot exceed 24 hours'
      }
    }
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'staff_services',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['staff_id', 'service_id']
    }
  ]
});

// Class Methods
StaffService.associate = function(models) {
  StaffService.belongsTo(models.User, {
    foreignKey: 'staff_id',
    as: 'staff',
    onDelete: 'CASCADE'
  });
  
  StaffService.belongsTo(models.Service, {
    foreignKey: 'service_id',
    as: 'service',
    onDelete: 'CASCADE'
  });
};

// Instance Methods
StaffService.prototype.getEffectivePrice = function() {
  return this.price_override !== null ? this.price_override : (this.service ? this.service.price : null);
};

StaffService.prototype.getEffectiveDuration = function() {
  return this.duration_override !== null ? this.duration_override : (this.service ? this.service.duration : null);
};

export default StaffService;
