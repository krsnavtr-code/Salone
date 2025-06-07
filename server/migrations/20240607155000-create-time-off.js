'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('TimeOff', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      staff_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
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
        type: Sequelize.ENUM(
          'pending',
          'approved',
          'rejected',
          'cancelled'
        ),
        defaultValue: 'pending',
        allowNull: false
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('TimeOff', ['staff_id']);
    await queryInterface.addIndex('TimeOff', ['start_date']);
    await queryInterface.addIndex('TimeOff', ['end_date']);
    await queryInterface.addIndex('TimeOff', ['status']);
    await queryInterface.addIndex('TimeOff', ['is_all_day']);
    
    // Add check constraint for date validation
    await queryInterface.sequelize.query(
      'ALTER TABLE `TimeOff` ADD CONSTRAINT chk_dates CHECK (end_date >= start_date)'
    );
    
    // Add check constraint for time validation when not all day
    await queryInterface.sequelize.query(
      'ALTER TABLE `TimeOff` ADD CONSTRAINT chk_times CHECK ' +
      '(is_all_day = 1 OR (start_time IS NOT NULL AND end_time IS NOT NULL AND end_time > start_time))'
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Drop check constraints first
    try {
      await queryInterface.sequelize.query(
        'ALTER TABLE `TimeOff` DROP CONSTRAINT IF EXISTS chk_dates'
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE `TimeOff` DROP CONSTRAINT IF EXISTS chk_times'
      );
    } catch (error) {
      console.warn('Error dropping check constraints:', error.message);
    }
    
    await queryInterface.dropTable('TimeOff');
  }
};
