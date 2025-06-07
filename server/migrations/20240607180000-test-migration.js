'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('Running test migration...');
    
    // Create a simple test table
    await queryInterface.createTable('test_table', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
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
    
    console.log('Test table created successfully');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('test_table');
  }
};
