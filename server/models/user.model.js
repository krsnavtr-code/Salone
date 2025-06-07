import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email already in use.'
    },
    validate: {
      isEmail: { msg: 'Please provide a valid email address.' },
      notEmpty: { msg: 'Email is required.' }
    }
  },
  phone: {
    type: DataTypes.STRING,
    validate: {
      is: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
    private: true
  },
  role: {
    type: DataTypes.ENUM('superadmin', 'admin', 'staff', 'customer'),
    defaultValue: 'customer',
    validate: {
      isIn: [['superadmin', 'admin', 'staff', 'customer']]
    }
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'suspended', 'deleted'),
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'suspended', 'deleted']]
    }
  },
  otp_code: {
    type: DataTypes.STRING,
    private: true
  },
  otp_expiry: {
    type: DataTypes.DATE,
    private: true
  },
  reset_password_token: {
    type: DataTypes.STRING,
    private: true
  },
  reset_password_expires: {
    type: DataTypes.DATE,
    private: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  defaultScope: {
    attributes: {
      exclude: ['password_hash', 'otp_code', 'otp_expiry', 'reset_password_token', 'reset_password_expires']
    }
  },
  scopes: {
    withSensitive: {
      attributes: {}
    },
    forAuth: {
      attributes: ['id', 'email', 'password_hash', 'role', 'status', 'email_verified']
    }
  }
});

// Instance Methods
User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.password_hash;
  delete values.otp_code;
  delete values.otp_expiry;
  delete values.reset_password_token;
  delete values.reset_password_expires;
  return values;
};

User.prototype.authenticate = async function(password) {
  if (!this.password_hash) return false;
  return bcrypt.compare(password, this.password_hash);
};

User.prototype.generateAuthToken = function() {
  return jwt.sign(
    {
      id: this.id,
      email: this.email,
      role: this.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Class Methods
User.beforeSave(async (user, options) => {
  if (user.changed('password_hash') && user.password_hash) {
    user.password_hash = await bcrypt.hash(user.password_hash, 12);
  }
});

User.associate = function(models) {
  // Define associations here
  // Example:
  // User.hasMany(models.Appointment, { foreignKey: 'userId' });
};

export default User;
