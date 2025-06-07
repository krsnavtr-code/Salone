'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StaffServices', {
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
      service_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Services',
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
        type: Sequelize.INTEGER, // in minutes
        allowNull: true
      },
      is_primary: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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


    // Add unique constraint to prevent duplicate staff-service pairs
    await queryInterface.addConstraint('StaffServices', {
      fields: ['staff_id', 'service_id'],
      type: 'unique',
      name: 'unique_staff_service'
    });

    // Add indexes
    await queryInterface.addIndex('StaffServices', ['staff_id']);
    await queryInterface.addIndex('StaffServices', ['service_id']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('StaffServices');
  }
};
