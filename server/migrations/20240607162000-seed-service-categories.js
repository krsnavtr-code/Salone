'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Define the initial categories
    const categories = [
      {
        name: 'Hair',
        slug: 'hair',
        description: 'Hair cutting, styling, and treatments',
        display_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Nails',
        slug: 'nails',
        description: 'Manicure, pedicure, and nail art services',
        display_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Skincare',
        slug: 'skincare',
        description: 'Facials, peels, and other skin treatments',
        display_order: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Massage',
        slug: 'massage',
        description: 'Therapeutic and relaxation massages',
        display_order: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Waxing',
        slug: 'waxing',
        description: 'Hair removal waxing services',
        display_order: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Makeup',
        slug: 'makeup',
        description: 'Professional makeup application',
        display_order: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Eyebrows & Lashes',
        slug: 'eyebrows-lashes',
        description: 'Eyebrow shaping and lash extensions',
        display_order: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Hair Removal',
        slug: 'hair-removal',
        description: 'Laser and other hair removal services',
        display_order: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Barber',
        slug: 'barber',
        description: 'Men\'s haircuts and grooming',
        display_order: 9,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Spa Packages',
        slug: 'spa-packages',
        description: 'Combination spa treatments',
        display_order: 10,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Other',
        slug: 'other',
        description: 'Other salon and spa services',
        display_order: 99,
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    // Insert the categories
    await queryInterface.bulkInsert('service_categories', categories, {});

    // Create a mapping of old category strings to new category IDs
    const categoryMap = {};
    const dbCategories = await queryInterface.sequelize.query(
      'SELECT id, slug FROM service_categories',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Create a map of slug to id
    const slugToId = {};
    dbCategories.forEach(cat => {
      slugToId[cat.slug] = cat.id;
    });

    // Map old category strings to new category IDs
    const oldToNewMap = {
      'hair': 'hair',
      'nails': 'nails',
      'skincare': 'skincare',
      'massage': 'massage',
      'waxing': 'waxing',
      'makeup': 'makeup',
      'eyebrows': 'eyebrows-lashes',
      'eyebrows_lashes': 'eyebrows-lashes',
      'eyebrows-lashes': 'eyebrows-lashes',
      'hair_removal': 'hair-removal',
      'hair-removal': 'hair-removal',
      'barber': 'barber',
      'spa': 'spa-packages',
      'spa-packages': 'spa-packages',
      'other': 'other'
    };

    // Update existing services to use the new category system
    const services = await queryInterface.sequelize.query(
      'SELECT id, category FROM services',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    for (const service of services) {
      if (service.category) {
        const normalizedCategory = service.category.trim().toLowerCase();
        const newSlug = oldToNewMap[normalizedCategory] || 'other';
        const categoryId = slugToId[newSlug];
        
        if (categoryId) {
          await queryInterface.sequelize.query(
            'UPDATE services SET category_id = ?, category = NULL WHERE id = ?',
            {
              replacements: [categoryId, service.id],
              type: queryInterface.sequelize.QueryTypes.UPDATE
            }
          );
        }
      }
    }

    // Remove the old category column if it exists
    const tableInfo = await queryInterface.describeTable('services');
    if (tableInfo.category) {
      await queryInterface.removeColumn('services', 'category');
    }
  },

  async down (queryInterface, Sequelize) {
    // Add the category column back if it doesn't exist
    const tableInfo = await queryInterface.describeTable('services');
    if (!tableInfo.category) {
      await queryInterface.addColumn('services', 'category', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // Get all services with their categories
    const services = await queryInterface.sequelize.query(
      `SELECT s.id, sc.slug 
       FROM services s
       LEFT JOIN service_categories sc ON s.category_id = sc.id`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    // Update services with the old category format
    for (const service of services) {
      await queryInterface.sequelize.query(
        'UPDATE services SET category = ? WHERE id = ?',
        {
          replacements: [service.slug || 'other', service.id],
          type: queryInterface.sequelize.QueryTypes.UPDATE
        }
      );
    }

    // Remove the category_id column
    await queryInterface.removeColumn('services', 'category_id');

    // Remove all categories
    await queryInterface.bulkDelete('service_categories', null, {});
  }
};
