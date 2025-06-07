'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('WorkingHours', {
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
      day_of_week: {
        type: Sequelize.ENUM(
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
          'sunday'
        ),
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

    // Add unique constraint to prevent duplicate staff-day pairs
    await queryInterface.addConstraint('WorkingHours', {
      fields: ['staff_id', 'day_of_week', 'valid_from'],
      type: 'unique',
      name: 'unique_staff_day_valid_from'
    });

    // Add indexes
    await queryInterface.addIndex('WorkingHours', ['staff_id']);
    await queryInterface.addIndex('WorkingHours', ['day_of_week']);
    await queryInterface.addIndex('WorkingHours', ['is_working']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('WorkingHours');
  }
};
