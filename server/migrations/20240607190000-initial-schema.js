'use strict';

console.log('Migration file is being loaded');

export default {
  async up(queryInterface, Sequelize) {
    console.log('Migration up() function is being executed');
    console.log('Sequelize version:', Sequelize.version);
    console.log('Database dialect:', queryInterface.sequelize.getDialect());
    
    // Test a simple query
    try {
      const result = await queryInterface.sequelize.query('SELECT 1+1 as result');
      console.log('Test query result:', result);
    } catch (error) {
      console.error('Test query failed:', error);
      throw error;
    }
    
    console.log('Creating initial database schema...');
    
    // 1. Create service_categories table
    await queryInterface.createTable('service_categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 2. Update services table
    await queryInterface.addColumn('services', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });

    await queryInterface.addColumn('services', 'category_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'service_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    });

    await queryInterface.addColumn('services', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true
    });

    await queryInterface.addColumn('services', 'display_order', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });

    // 3. Update appointments table
    await queryInterface.addColumn('appointments', 'end_date', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('appointments', 'staff_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true
    });

    await queryInterface.addColumn('appointments', 'price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true
    });

    await queryInterface.addColumn('appointments', 'duration', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Duration in minutes'
    });

    await queryInterface.addColumn('appointments', 'cancellation_reason', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('appointments', 'cancelled_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    await queryInterface.addColumn('appointments', 'completed_at', {
      type: Sequelize.DATE,
      allowNull: true
    });

    // 4. Create staff_services table
    await queryInterface.createTable('staff_services', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      staff_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'services',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      price_override: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      duration_override: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Duration in minutes'
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 5. Create working_hours table
    await queryInterface.createTable('working_hours', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      staff_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      day_of_week: {
        type: Sequelize.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
        allowNull: false
      },
      is_working: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '09:00:00'
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: '17:00:00'
      },
      break_start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      break_end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      valid_from: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      valid_until: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 6. Create time_off table
    await queryInterface.createTable('time_off', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      staff_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      start_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      start_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      end_time: {
        type: Sequelize.TIME,
        allowNull: true
      },
      is_all_day: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false
      },
      approved_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        allowNull: true
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      rejection_reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 7. Add indexes
    await queryInterface.addIndex('staff_services', ['staff_id', 'service_id'], {
      unique: true,
      name: 'unique_staff_service'
    });

    await queryInterface.addIndex('working_hours', ['staff_id', 'day_of_week', 'valid_from'], {
      unique: true,
      name: 'unique_staff_day_valid_from'
    });

    console.log('Initial database schema created successfully');
  },

  async down(queryInterface, Sequelize) {
    console.log('Dropping database schema...');
    
    // Drop tables in reverse order
    await queryInterface.dropTable('time_off');
    await queryInterface.dropTable('working_hours');
    await queryInterface.dropTable('staff_services');
    
    // Remove added columns
    await queryInterface.removeColumn('appointments', 'completed_at');
    await queryInterface.removeColumn('appointments', 'cancelled_at');
    await queryInterface.removeColumn('appointments', 'cancellation_reason');
    await queryInterface.removeColumn('appointments', 'duration');
    await queryInterface.removeColumn('appointments', 'price');
    await queryInterface.removeColumn('appointments', 'staff_id');
    await queryInterface.removeColumn('appointments', 'end_date');
    
    await queryInterface.removeColumn('services', 'display_order');
    await queryInterface.removeColumn('services', 'is_active');
    await queryInterface.removeColumn('services', 'category_id');
    await queryInterface.removeColumn('services', 'slug');
    
    await queryInterface.dropTable('service_categories');
    
    console.log('Database schema dropped successfully');
  }
};
