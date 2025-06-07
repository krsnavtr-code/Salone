import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/db.js';

const ServiceCategory = sequelize.define('ServiceCategory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Category name is required' },
      len: {
        args: [2, 100],
        msg: 'Category name must be between 2 and 100 characters'
      }
    }
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Slug is required' },
      is: {
        args: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        msg: 'Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Description cannot exceed 1000 characters'
      }
    }
  },
  image_url: {
    type: DataTypes.STRING,
    validate: {
      isUrl: {
        msg: 'Image URL must be a valid URL',
        args: {
          protocols: ['http', 'https'],
          require_protocol: true
        }
      }
    }
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: {
        msg: 'Display order must be an integer'
      }
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'service_categories',
  timestamps: true,
  underscored: true,
  defaultScope: {
    where: { is_active: true },
    order: [['display_order', 'ASC'], ['name', 'ASC']]
  },
  scopes: {
    active: {
      where: { is_active: true }
    },
    inactive: {
      where: { is_active: false }
    },
    search(query) {
      return {
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: `%${query}%` } },
            { description: { [Op.iLike]: `%${query}%` } }
          ]
        }
      };
    },
    withServices: {
      include: [
        {
          model: sequelize.models.Service,
          as: 'services',
          where: { is_active: true },
          required: false
        }
      ]
    }
  }
});

// Instance Methods
ServiceCategory.prototype.toJSON = function() {
  const values = { ...this.get() };
  
  // Remove sensitive or unnecessary fields
  delete values.created_at;
  delete values.updated_at;
  
  return values;
};

// Class Methods
ServiceCategory.associate = function(models) {
  ServiceCategory.hasMany(models.Service, {
    foreignKey: 'category_id',
    as: 'services',
    onDelete: 'SET NULL'
  });
};

// Hooks
const generateSlug = async (category) => {
  if (!category.slug && category.name) {
    const baseSlug = category.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Replace multiple - with single -
    
    // Ensure slug is unique
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existing = await ServiceCategory.findOne({ where: { slug } });
      if (!existing || existing.id === category.id) break;
      slug = `${baseSlug}-${counter++}`;
    }
    
    category.slug = slug;
  }
};

ServiceCategory.beforeCreate(generateSlug);
ServiceCategory.beforeUpdate(generateSlug);

// Static Methods
ServiceCategory.findBySlug = async function(slug, options = {}) {
  const query = {
    where: { slug },
    ...options
  };
  
  return this.scope(options.scope || null).findOne(query);
};

export default ServiceCategory;
