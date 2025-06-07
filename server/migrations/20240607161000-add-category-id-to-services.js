'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the category_id column to the services table
    await queryInterface.addColumn('services', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'service_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // Add an index for better query performance
    await queryInterface.addIndex('services', ['category_id']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the index first
    await queryInterface.removeIndex('services', ['category_id']);
    
    // Then remove the column
    await queryInterface.removeColumn('services', 'category_id');
  }
};
