import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/db.js';

// Define appointment statuses
const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show'
};

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  appointment_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: 'Appointment date must be a valid date' },
      isFutureDate(value) {
        if (new Date(value) < new Date()) {
          throw new Error('Appointment date must be in the future');
        }
      }
    }
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: 'End date must be a valid date' },
      isAfterStartDate(value) {
        if (new Date(value) <= this.appointment_date) {
          throw new Error('End date must be after appointment date');
        }
      }
    }
  },
  status: {
    type: DataTypes.ENUM(
      APPOINTMENT_STATUS.PENDING,
      APPOINTMENT_STATUS.CONFIRMED,
      APPOINTMENT_STATUS.IN_PROGRESS,
      APPOINTMENT_STATUS.COMPLETED,
      APPOINTMENT_STATUS.CANCELLED,
      APPOINTMENT_STATUS.NO_SHOW
    ),
    defaultValue: APPOINTMENT_STATUS.PENDING,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Notes cannot exceed 1000 characters'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: [0],
        msg: 'Price cannot be negative'
      }
    }
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: 'Duration must be at least 1 minute'
      }
    }
  },
  cancellation_reason: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Cancellation reason cannot exceed 500 characters'
      }
    }
  },
  cancelled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  underscored: true,
  defaultScope: {
    order: [['appointment_date', 'ASC']]
  },
  scopes: {
    upcoming: {
      where: {
        appointment_date: {
          [Op.gte]: new Date()
        },
        status: {
          [Op.in]: [
            APPOINTMENT_STATUS.PENDING,
            APPOINTMENT_STATUS.CONFIRMED,
            APPOINTMENT_STATUS.IN_PROGRESS
          ]
        }
      },
      order: [['appointment_date', 'ASC']]
    },
    past: {
      where: {
        [Op.or]: [
          { appointment_date: { [Op.lt]: new Date() } },
          { status: APPOINTMENT_STATUS.COMPLETED },
          { status: APPOINTMENT_STATUS.CANCELLED },
          { status: APPOINTMENT_STATUS.NO_SHOW }
        ]
      },
      order: [['appointment_date', 'DESC']]
    },
    forUser(userId) {
      return {
        where: { user_id: userId },
        order: [['appointment_date', 'DESC']]
      };
    },
    forStaff(staffId) {
      return {
        where: { staff_id: staffId },
        order: [['appointment_date', 'DESC']]
      };
    },
    forService(serviceId) {
      return {
        where: { service_id: serviceId }
      };
    },
    withStatus(status) {
      return {
        where: { status }
      };
    },
    betweenDates(startDate, endDate) {
      return {
        where: {
          appointment_date: {
            [Op.between]: [startDate, endDate]
          }
        },
        order: [['appointment_date', 'ASC']]
      };
    }
  }
});

// Instance Methods
Appointment.prototype.cancel = async function(reason, userId) {
  if (this.status === APPOINTMENT_STATUS.CANCELLED) {
    throw new Error('Appointment is already cancelled');
  }
  
  if (this.status === APPOINTMENT_STATUS.COMPLETED) {
    throw new Error('Cannot cancel a completed appointment');
  }
  
  this.status = APPOINTMENT_STATUS.CANCELLED;
  this.cancellation_reason = reason || 'Cancelled by user';
  this.cancelled_at = new Date();
  this.cancelled_by = userId;
  
  return this.save();
};

Appointment.prototype.complete = async function(notes = '') {
  if (this.status === APPOINTMENT_STATUS.CANCELLED) {
    throw new Error('Cannot complete a cancelled appointment');
  }
  
  if (this.status === APPOINTMENT_STATUS.COMPLETED) {
    throw new Error('Appointment is already marked as completed');
  }
  
  this.status = APPOINTMENT_STATUS.COMPLETED;
  this.notes = notes || this.notes;
  this.completed_at = new Date();
  
  return this.save();
};

Appointment.prototype.reschedule = async function(newDate, duration) {
  if (this.status === APPOINTMENT_STATUS.CANCELLED) {
    throw new Error('Cannot reschedule a cancelled appointment');
  }
  
  if (this.status === APPOINTMENT_STATUS.COMPLETED) {
    throw new Error('Cannot reschedule a completed appointment');
  }
  
  const endDate = new Date(newDate);
  endDate.setMinutes(endDate.getMinutes() + (duration || this.duration));
  
  this.appointment_date = newDate;
  this.end_date = endDate;
  this.duration = duration || this.duration;
  this.status = APPOINTMENT_STATUS.PENDING; // Reset status to pending
  
  return this.save();
};

// Class Methods
Appointment.associate = function(models) {
  Appointment.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  
  Appointment.belongsTo(models.User, {
    foreignKey: 'staff_id',
    as: 'staff'
  });
  
  Appointment.belongsTo(models.Service, {
    foreignKey: 'service_id',
    as: 'service'
  });
};

// Hooks
const setEndDate = async (appointment) => {
  if (appointment.appointment_date && !appointment.end_date) {
    const endDate = new Date(appointment.appointment_date);
    endDate.setMinutes(endDate.getMinutes() + (appointment.duration || 30));
    appointment.end_date = endDate;
  }
};

Appointment.beforeCreate(setEndDate);
Appointment.beforeUpdate(setEndDate);

// Static Methods
Appointment.getStatuses = () => Object.values(APPOINTMENT_STATUS);

// Export the status constants
export { APPOINTMENT_STATUS };
export default Appointment;
