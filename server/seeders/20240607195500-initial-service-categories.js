'use strict';

const categories = [
  {
    name: 'Hair Services',
    slug: 'hair-services',
    description: 'Professional hair care and styling services',
    display_order: 1,
    is_active: true
  },
  {
    name: 'Nail Services',
    slug: 'nail-services',
    description: 'Manicure and pedicure services',
    display_order: 2,
    is_active: true
  },
  {
    name: 'Skin Care',
    slug: 'skin-care',
    description: 'Facials and skin treatments',
    display_order: 3,
    is_active: true
  },
  {
    name: 'Waxing',
    slug: 'waxing',
    description: 'Hair removal services',
    display_order: 4,
    is_active: true
  },
  {
    name: 'Makeup',
    slug: 'makeup',
    description: 'Professional makeup application',
    display_order: 5,
    is_active: true
  },
  {
    name: 'Massage',
    slug: 'massage',
    description: 'Relaxation and therapeutic massage',
    display_order: 6,
    is_active: true
  }
];

export default {
  up: async (queryInterface, Sequelize) => {
    console.log('Seeding service categories...');
    
    // Only insert categories that don't already exist
    const existingCategories = await queryInterface.sequelize.query(
      'SELECT slug FROM service_categories',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );
    
    const existingSlugs = existingCategories.map(cat => cat.slug);
    const newCategories = categories.filter(cat => !existingSlugs.includes(cat.slug));
    
    if (newCategories.length > 0) {
      await queryInterface.bulkInsert('service_categories', newCategories);
      console.log(`Added ${newCategories.length} new service categories`);
    } else {
      console.log('All service categories already exist');
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('Removing service categories...');
    await queryInterface.bulkDelete('service_categories', null, {});
  }
};
