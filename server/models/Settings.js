const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  openingHours: {
    monday: {
      type: String,
      default: '09:00-18:00',
    },
    tuesday: {
      type: String,
      default: '09:00-18:00',
    },
    wednesday: {
      type: String,
      default: '09:00-18:00',
    },
    thursday: {
      type: String,
      default: '09:00-18:00',
    },
    friday: {
      type: String,
      default: '09:00-18:00',
    },
    saturday: {
      type: String,
      default: '09:00-18:00',
    },
    sunday: {
      type: String,
      default: 'Closed',
    },
  },
  socialLinks: {
    facebook: {
      type: String,
      default: '',
    },
    instagram: {
      type: String,
      default: '',
    },
    twitter: {
      type: String,
      default: '',
    },
  },
  workingDays: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
  }],
  businessHours: {
    start: {
      type: String,
      default: '09:00',
    },
    end: {
      type: String,
      default: '18:00',
    },
  },
}, {
  timestamps: true,
});

// Ensure only one settings document exists
settingsSchema.pre('save', async function(next) {
  const settingsCount = await this.constructor.countDocuments();
  if (settingsCount > 0) {
    throw new Error('Only one settings document can exist');
  }
  next();
});

module.exports = mongoose.model('Settings', settingsSchema);
