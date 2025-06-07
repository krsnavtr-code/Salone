import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/db.js';

// Define time off statuses
const TIMEOFF_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

const TimeOff = sequelize.define('TimeOff', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Start date must be a valid date (YYYY-MM-DD)'
      },
      isBeforeEndDate(value) {
        if (this.end_date && new Date(value) > new Date(this.end_date)) {
          throw new Error('Start date must be before or equal to end date');
        }
      },
      notInPast(value) {
        if (new Date(value) < new Date().setHours(0, 0, 0, 0)) {
          throw new Error('Start date cannot be in the past');
        }
      }
    }
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'End date must be a valid date (YYYY-MM-DD)'
      },
      isAfterStartDate(value) {
        if (this.start_date && new Date(value) < new Date(this.start_date)) {
          throw new Error('End date must be after or equal to start date');
        }
      }
    }
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: true,
    validate: {
      isTimeString: {
        msg: 'Start time must be a valid time string (HH:MM:SS)',
        args: true
      },
      isBeforeEndTime(value) {
        if (!this.is_all_day && this.end_time && value >= this.end_time) {
          throw new Error('Start time must be before end time');
        }
      },
      requiredIfNotAllDay(value) {
        if (!this.is_all_day && !value) {
          throw new Error('Start time is required when not all day');
        }
      }
    }
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: true,
    validate: {
      isTimeString: {
        msg: 'End time must be a valid time string (HH:MM:SS)',
        args: true
      },
      isAfterStartTime(value) {
        if (!this.is_all_day && this.start_time && value <= this.start_time) {
          throw new Error('End time must be after start time');
        }
      },
      requiredIfNotAllDay(value) {
        if (!this.is_all_day && !value) {
          throw new Error('End time is required when not all day');
        }
      }
    }
  },
  is_all_day: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  reason: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Reason cannot exceed 1000 characters'
      }
    }
  },
  status: {
    type: DataTypes.ENUM(
      TIMEOFF_STATUS.PENDING,
      TIMEOFF_STATUS.APPROVED,
      TIMEOFF_STATUS.REJECTED,
      TIMEOFF_STATUS.CANCELLED
    ),
    defaultValue: TIMEOFF_STATUS.PENDING,
    allowNull: false,
    validate: {
      isIn: {
        args: [Object.values(TIMEOFF_STATUS)],
        msg: 'Invalid status'
      }
    }
  },
  rejection_reason: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Rejection reason cannot exceed 500 characters'
      },
      requiredIfRejected(value) {
        if (this.status === TIMEOFF_STATUS.REJECTED && !value) {
          throw new Error('Rejection reason is required when status is rejected');
        }
      }
    }
  },
  approved_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'time_off',
  timestamps: true,
  underscored: true,
  defaultScope: {
    order: [
      ['start_date', 'ASC'],
      ['start_time', 'ASC']
    ]
  },
  scopes: {
    pending: {
      where: { status: TIMEOFF_STATUS.PENDING }
    },
    approved: {
      where: { status: TIMEOFF_STATUS.APPROVED }
    },
    rejected: {
      where: { status: TIMEOFF_STATUS.REJECTED }
    },
    cancelled: {
      where: { status: TIMEOFF_STATUS.CANCELLED }
    },
    forStaff(staffId) {
      return {
        where: { staff_id: staffId }
      };
    },
    forApprover(approverId) {
      return {
        where: {
          status: TIMEOFF_STATUS.PENDING,
          staff_id: {
            [Op.ne]: approverId // Can't approve own requests (handled in controller)
          }
        }
      };
    },
    overlapping(startDate, endDate, startTime = null, endTime = null) {
      const where = {
        [Op.and]: [
          // Date range overlaps
          {
            start_date: { [Op.lte]: endDate },
            end_date: { [Op.gte]: startDate }
          }
        ]
      };

      // If time is provided, check time overlap
      if (startTime && endTime) {
        where[Op.and].push({
          [Op.or]: [
            // All-day events overlap with any time
            { is_all_day: true },
            // Time ranges overlap
            {
              [Op.and]: [
                { is_all_day: false },
                { start_time: { [Op.lt]: endTime } },
                { end_time: { [Op.gt]: startTime } }
              ]
            }
          ]
        });
      }

      return { where };
    },
    inDateRange(startDate, endDate) {
      return {
        where: {
          [Op.or]: [
            // Starts or ends within the range
            {
              [Op.and]: [
                { start_date: { [Op.gte]: startDate } },
                { start_date: { [Op.lte]: endDate } }
              ]
            },
            {
              [Op.and]: [
                { end_date: { [Op.gte]: startDate } },
                { end_date: { [Op.lte]: endDate } }
              ]
            },
            // Spans the entire range
            {
              [Op.and]: [
                { start_date: { [Op.lte]: startDate } },
                { end_date: { [Op.gte]: endDate } }
              ]
            }
          ]
        }
      };
    }
  }
});

// Instance Methods
TimeOff.prototype.approve = async function(approverId) {
  if (this.status !== TIMEOFF_STATUS.PENDING) {
    throw new Error(`Cannot approve a ${this.status} time off request`);
  }
  
  if (this.staff_id === approverId) {
    throw new Error('Cannot approve your own time off request');
  }
  
  this.status = TIMEOFF_STATUS.APPROVED;
  this.approved_by = approverId;
  this.approved_at = new Date();
  this.rejection_reason = null;
  
  return this.save();
};

TimeOff.prototype.reject = async function(approverId, reason) {
  if (this.status !== TIMEOFF_STATUS.PENDING) {
    throw new Error(`Cannot reject a ${this.status} time off request`);
  }
  
  if (this.staff_id === approverId) {
    throw new Error('Cannot reject your own time off request');
  }
  
  if (!reason || reason.trim().length === 0) {
    throw new Error('Rejection reason is required');
  }
  
  this.status = TIMEOFF_STATUS.REJECTED;
  this.approved_by = approverId;
  this.approved_at = new Date();
  this.rejection_reason = reason;
  
  return this.save();
};

TimeOff.prototype.cancel = async function(userId) {
  if (this.status !== TIMEOFF_STATUS.PENDING && this.status !== TIMEOFF_STATUS.APPROVED) {
    throw new Error(`Cannot cancel a ${this.status} time off request`);
  }
  
  if (this.staff_id !== userId) {
    throw new Error('You can only cancel your own time off requests');
  }
  
  this.status = TIMEOFF_STATUS.CANCELLED;
  this.rejection_reason = 'Cancelled by user';
  
  return this.save();
};

// Class Methods
TimeOff.associate = function(models) {
  TimeOff.belongsTo(models.User, {
    foreignKey: 'staff_id',
    as: 'staff',
    onDelete: 'CASCADE'
  });
  
  TimeOff.belongsTo(models.User, {
    foreignKey: 'approved_by',
    as: 'approver',
    onDelete: 'SET NULL'
  });
};

// Hooks
const validateTimeOff = async (timeOff) => {
  // Ensure start_date <= end_date
  if (timeOff.start_date > timeOff.end_date) {
    throw new Error('Start date must be before or equal to end date');
  }
  
  // If not all day, ensure times are provided and valid
  if (!timeOff.is_all_day) {
    if (!timeOff.start_time || !timeOff.end_time) {
      throw new Error('Start time and end time are required when not all day');
    }
    
    if (timeOff.start_time >= timeOff.end_time) {
      throw new Error('Start time must be before end time');
    }
  } else {
    // Clear times for all-day events
    timeOff.start_time = null;
    timeOff.end_time = null;
  }
  
  // Check for overlapping time off requests
  const overlapping = await TimeOff.scope([
    'defaultScope',
    { method: ['overlapping', timeOff.start_date, timeOff.end_date, timeOff.start_time, timeOff.end_time] },
    { method: ['forStaff', timeOff.staff_id] }
  ]).findOne({
    where: {
      id: { [Op.ne]: timeOff.id || null },
      status: {
        [Op.in]: [TIMEOFF_STATUS.PENDING, TIMEOFF_STATUS.APPROVED]
      }
    }
  });
  
  if (overlapping) {
    throw new Error('Time off request overlaps with an existing request');
  }
};

TimeOff.beforeCreate(validateTimeOff);
TimeOff.beforeUpdate(validateTimeOff);

// Static Methods
TimeOff.getStatuses = () => Object.values(TIMEOFF_STATUS);

// Export the status constants
export { TIMEOFF_STATUS };
export default TimeOff;
