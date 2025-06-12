import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/db.js';

// Define categories for services
const SERVICE_CATEGORIES = [
  'hair', 'nails', 'skincare', 'massage', 'waxing', 
  'makeup', 'eyebrows', 'hair_removal', 'barber', 'spa', 'other'
];

const Service = sequelize.define('Service', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Service name is required' },
      len: {
        args: [2, 100],
        msg: 'Service name must be between 2 and 100 characters'
      }
    }
  },
  slug: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Description cannot be longer than 1000 characters'
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
      },
      isDecimal: {
        msg: 'Price must be a valid decimal number'
      }
    }
  },
  duration: {
    type: DataTypes.INTEGER, // in minutes
    allowNull: false,
    defaultValue: 30,
    validate: {
      min: {
        args: [1],
        msg: 'Duration must be at least 1 minute'
      },
      max: {
        args: [1440],
        msg: 'Duration cannot exceed 24 hours'
      }
    }
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: {
        args: [0, 100],
        msg: 'Category cannot exceed 100 characters'
      }
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'service_categories',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  image_url: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Image URL must be a valid URL'
      }
    }
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: true
    }
  }
}, {
  tableName: 'services',
  timestamps: true,
  underscored: true,
  defaultScope: {
    where: {
      is_active: true
    },
    order: [['display_order', 'ASC'], ['name', 'ASC']]
  },
  scopes: {
    active: {
      where: { is_active: true }
    },
    inactive: {
      where: { is_active: false }
    },
    byCategory(category) {
      if (typeof category === 'number' || /^\d+$/.test(category)) {
        return {
          where: { category_id: category }
        };
      }
      return {
        where: { 
          [Op.or]: [
            { category },
            { '$category.name$': category }
          ]
        },
        include: [
          {
            model: sequelize.models.ServiceCategory,
            as: 'category',
            attributes: [],
            required: false
          }
        ]
      };
    },
    byCategoryId(categoryId) {
      return {
        where: { category_id: categoryId }
      };
    }, 
    search(query) {
      return {
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } },
            { '$category.name$': { [Op.iLike]: `%${query}%` } }
          ]
        },
        include: [
          {
            model: sequelize.models.ServiceCategory,
            as: 'category',
            attributes: [],
            required: false
          }
        ]
      };
    },
    withCategory: {
      include: [
        {
          model: sequelize.models.ServiceCategory,
          as: 'category',
          required: false
        }
      ]
    }
  }
});

// Instance Methods
Service.prototype.getFormattedPrice = function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.price);
};

Service.prototype.getFormattedDuration = function() {
  const hours = Math.floor(this.duration / 60);
  const minutes = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
};

// Hooks
const generateSlug = async (service) => {
  if (!service.slug && service.name) {
    const baseSlug = service.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Replace multiple - with single -
    
    // Ensure slug is unique
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await Service.findOne({ where: { slug } });
      if (!existing || existing.id === service.id) break;
      slug = `${baseSlug}-${counter++}`;
    }
    
    service.slug = slug;
    return service;
  }
  return service;
};

// Generate slug before validation to ensure it's set
Service.beforeValidate(async (service) => {
  if (!service.slug && service.name) {
    await generateSlug(service);
  }
  return service;
});

Service.beforeCreate(generateSlug);
Service.beforeUpdate(generateSlug);

// Class Methods
Service.associate = function(models) {
  Service.hasMany(models.Appointment, {
    foreignKey: 'service_id',
    as: 'appointments'
  });
  
  Service.belongsToMany(models.User, {
    through: 'StaffServices',
    foreignKey: 'service_id',
    as: 'staffMembers'
  });
  
  Service.belongsTo(models.ServiceCategory, {
    foreignKey: 'category_id',
    as: 'category',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
  });
};

// export { SERVICE_CATEGORIES };
export default Service;
