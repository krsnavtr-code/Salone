'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Update users table
      await queryInterface.addColumn(
        'users',
        'email_verified',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'users',
        'last_login',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'users',
        'status',
        {
          type: Sequelize.ENUM('active', 'inactive', 'suspended'),
          allowNull: false,
          defaultValue: 'active'
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'users',
        'reset_password_token',
        {
          type: Sequelize.STRING,
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'users',
        'reset_password_expiry',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );

      // 2. Update services table
      await queryInterface.addColumn(
        'services',
        'slug',
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'services',
        'category_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'service_categories',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'services',
        'is_active',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'services',
        'display_order',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        { transaction }
      );

      // 3. Update appointments table
      await queryInterface.addColumn(
        'appointments',
        'end_date',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'appointments',
        'staff_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'appointments',
        'price',
        {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'appointments',
        'duration',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          comment: 'Duration in minutes'
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'appointments',
        'cancellation_reason',
        {
          type: Sequelize.TEXT,
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'appointments',
        'cancelled_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'appointments',
        'completed_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );

      // Update the status enum to include new statuses (MySQL specific)
      await queryInterface.sequelize.query(
        `ALTER TABLE appointments 
         MODIFY COLUMN status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show') 
         CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci 
         NOT NULL DEFAULT 'pending'`,
        { transaction }
      );

      // 4. Create new tables
      await queryInterface.createTable('service_categories', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
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
      }, { transaction });

      await queryInterface.createTable('staff_services', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
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
      }, { transaction });

      await queryInterface.createTable('working_hours', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
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
      }, { transaction });

      await queryInterface.createTable('time_off', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
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
      }, { transaction });

      // 5. Create indexes
      await queryInterface.addIndex('staff_services', ['staff_id'], { transaction });
      await queryInterface.addIndex('staff_services', ['service_id'], { transaction });
      await queryInterface.addIndex('working_hours', ['staff_id'], { transaction });
      await queryInterface.addIndex('working_hours', ['day_of_week'], { transaction });
      await queryInterface.addIndex('time_off', ['staff_id'], { transaction });
      await queryInterface.addIndex('time_off', ['start_date', 'end_date'], { transaction });
      await queryInterface.addIndex('time_off', ['status'], { transaction });

      // 6. Add unique constraint for staff_services
      await queryInterface.addConstraint('staff_services', {
        fields: ['staff_id', 'service_id'],
        type: 'unique',
        name: 'unique_staff_service',
        transaction
      });

      // 7. Add unique constraint for working_hours
      await queryInterface.addConstraint('working_hours', {
        fields: ['staff_id', 'day_of_week', 'valid_from'],
        type: 'unique',
        name: 'unique_staff_day_valid_from',
        transaction
      });

      // 8. Add check constraints for time_off
      await queryInterface.sequelize.query(
        'ALTER TABLE time_off ADD CONSTRAINT chk_dates CHECK (end_date >= start_date)',
        { transaction }
      );

      await queryInterface.sequelize.query(
        'ALTER TABLE time_off ADD CONSTRAINT chk_times CHECK ' +
        '(is_all_day = 1 OR (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time))',
        { transaction }
      );

      // 9. Update existing data
      // Set default slug for existing services (MySQL compatible)
      await queryInterface.sequelize.query(
        `UPDATE services SET slug = LOWER(REPLACE(REPLACE(REPLACE(COALESCE(name, ''), ' ', '-'), '&', 'and'), '--', '-'))`,
        { transaction }
      );

      // Set end_date for existing appointments (MySQL compatible)
      await queryInterface.sequelize.query(
        `UPDATE appointments 
         SET end_date = IFNULL(end_date, DATE_ADD(appointment_date, INTERVAL 1 HOUR)) 
         WHERE end_date IS NULL`,
        { transaction }
      );

      // Set default price and duration for existing appointments (MySQL compatible)
      await queryInterface.sequelize.query(
        `UPDATE appointments a 
         INNER JOIN services s ON a.service_id = s.id 
         SET a.price = IFNULL(a.price, s.price), 
             a.duration = IFNULL(a.duration, s.duration) 
         WHERE a.price IS NULL OR a.duration IS NULL`,
        { transaction }
      );

      // Add indexes (MySQL specific)
      await queryInterface.addIndex('services', ['slug'], {
        name: 'services_slug',
        unique: true,
        transaction
      });

      await queryInterface.addIndex('appointments', ['appointment_date', 'end_date'], {
        name: 'appointments_dates',
        transaction
      });

      await transaction.commit();
      console.log('✅ Database schema updated successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error updating database schema:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // Note: This is a one-way migration. Rolling back would require dropping columns
    // which could result in data loss. In a production environment, you would want to
    // create a backup before running this migration.
    console.warn('⚠️ Rolling back this migration is not recommended as it may cause data loss');
  }
};
