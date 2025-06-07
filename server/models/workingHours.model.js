import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/db.js';

// Define days of the week
const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

const WorkingHours = sequelize.define('WorkingHours', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  day_of_week: {
    type: DataTypes.ENUM(...DAYS_OF_WEEK),
    allowNull: false,
    validate: {
      isIn: {
        args: [DAYS_OF_WEEK],
        msg: 'Invalid day of week'
      }
    }
  },
  is_working: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '09:00:00',
    validate: {
      isTimeString: {
        msg: 'Start time must be a valid time string (HH:MM:SS)'
      },
      isBeforeEndTime(value) {
        if (this.is_working && this.end_time && value >= this.end_time) {
          throw new Error('Start time must be before end time');
        }
      }
    }
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: false,
    defaultValue: '17:00:00',
    validate: {
      isTimeString: {
        msg: 'End time must be a valid time string (HH:MM:SS)'
      },
      isAfterStartTime(value) {
        if (this.is_working && this.start_time && value <= this.start_time) {
          throw new Error('End time must be after start time');
        }
      }
    }
  },
  break_start_time: {
    type: DataTypes.TIME,
    allowNull: true,
    validate: {
      isTimeString: {
        msg: 'Break start time must be a valid time string (HH:MM:SS)',
        args: true
      },
      isBeforeBreakEnd(value) {
        if (value && this.break_end_time && value >= this.break_end_time) {
          throw new Error('Break start time must be before break end time');
        }
      },
      isWithinWorkingHours(value) {
        if (value && this.start_time && value < this.start_time) {
          throw new Error('Break start time must be within working hours');
        }
      }
    }
  },
  break_end_time: {
    type: DataTypes.TIME,
    allowNull: true,
    validate: {
      isTimeString: {
        msg: 'Break end time must be a valid time string (HH:MM:SS)',
        args: true
      },
      isAfterBreakStart(value) {
        if (value && this.break_start_time && value <= this.break_start_time) {
          throw new Error('Break end time must be after break start time');
        }
      },
      isWithinWorkingHours(value) {
        if (value && this.end_time && value > this.end_time) {
          throw new Error('Break end time must be within working hours');
        }
      }
    }
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  valid_from: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Valid from must be a valid date (YYYY-MM-DD)'
      },
      isBeforeValidUntil(value) {
        if (value && this.valid_until && value > this.valid_until) {
          throw new Error('Valid from must be before or equal to valid until');
        }
      }
    }
  },
  valid_until: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Valid until must be a valid date (YYYY-MM-DD)'
      },
      isAfterValidFrom(value) {
        if (value && this.valid_from && value < this.valid_from) {
          throw new Error('Valid until must be after or equal to valid from');
        }
      }
    }
  }
}, {
  tableName: 'working_hours',
  timestamps: true,
  underscored: true,
  defaultScope: {
    where: {
      is_working: true
    },
    order: [
      ['day_of_week', 'ASC'],
      ['start_time', 'ASC']
    ]
  },
  scopes: {
    active: {
      where: {
        is_working: true,
        [Op.or]: [
          {
            valid_from: { [Op.lte]: new Date() },
            valid_until: null
          },
          {
            valid_from: { [Op.lte]: new Date() },
            valid_until: { [Op.gte]: new Date() }
          },
          {
            valid_from: null,
            valid_until: { [Op.gte]: new Date() }
          },
          {
            valid_from: null,
            valid_until: null
          }
        ]
      }
    },
    forDay(dayOfWeek) {
      return {
        where: { day_of_week: dayOfWeek.toLowerCase() }
      };
    },
    forStaff(staffId) {
      return {
        where: { staff_id: staffId }
      };
    },
    defaults: {
      where: { is_default: true }
    },
    specificDate(date) {
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'monday' }).toLowerCase();
      const dateStr = date.toISOString().split('T')[0];
      
      return {
        where: {
          [Op.or]: [
            // Specific schedule for this date
            {
              valid_from: dateStr,
              valid_until: dateStr
            },
            // Default schedule that covers this date
            {
              is_default: true,
              day_of_week: dayOfWeek,
              [Op.or]: [
                { valid_from: null, valid_until: null },
                { valid_from: { [Op.lte]: dateStr }, valid_until: null },
                { valid_from: null, valid_until: { [Op.gte]: dateStr } },
                {
                  valid_from: { [Op.lte]: dateStr },
                  valid_until: { [Op.gte]: dateStr }
                }
              ]
            }
          ]
        },
        order: [
          // Prefer specific date overrides
          [sequelize.literal('CASE WHEN valid_from = valid_until THEN 0 ELSE 1 END'), 'ASC'],
          // Then by day of week
          [sequelize.literal('FIELD(day_of_week, "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday")'), 'ASC'],
          // Then by start time
          ['start_time', 'ASC']
        ]
      };
    }
  }
});

// Class Methods
WorkingHours.associate = function(models) {
  WorkingHours.belongsTo(models.User, {
    foreignKey: 'staff_id',
    as: 'staff',
    onDelete: 'CASCADE'
  });
};

// Instance Methods
WorkingHours.prototype.isAvailableAt = function(dateTime) {
  if (!this.is_working) return false;
  
  const time = dateTime.toTimeString().split(' ')[0];
  
  // Check if within working hours
  if (time < this.start_time || time > this.end_time) {
    return false;
  }
  
  // Check if within break time
  if (this.break_start_time && this.break_end_time) {
    if (time >= this.break_start_time && time <= this.break_end_time) {
      return false;
    }
  }
  
  return true;
};

// Static Methods
WorkingHours.getDaysOfWeek = () => [...DAYS_OF_WEEK];

// Hooks
const validateBreakTimes = (workingHours) => {
  if (workingHours.break_start_time && !workingHours.break_end_time) {
    throw new Error('Break end time is required when break start time is provided');
  }
  
  if (!workingHours.break_start_time && workingHours.break_end_time) {
    throw new Error('Break start time is required when break end time is provided');
  }
};

WorkingHours.beforeCreate(validateBreakTimes);
WorkingHours.beforeUpdate(validateBreakTimes);

export { DAYS_OF_WEEK };
export default WorkingHours;
