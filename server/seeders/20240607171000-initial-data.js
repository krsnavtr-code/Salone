ers, 'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Create Service Categories
      const categories = [
        {
          name: 'Hair',
          slug: 'hair',
          description: 'Hair cutting, styling, and treatments',
          display_order: 1,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Nails',
          slug: 'nails',
          description: 'Manicure, pedicure, and nail art services',
          display_order: 2,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Skincare',
          slug: 'skincare',
          description: 'Facials, peels, and other skin treatments',
          display_order: 3,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Massage',
          slug: 'massage',
          description: 'Therapeutic and relaxation massages',
          display_order: 4,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Waxing',
          slug: 'waxing',
          description: 'Hair removal waxing services',
          display_order: 5,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Makeup',
          slug: 'makeup',
          description: 'Professional makeup application',
          display_order: 6,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Eyebrows & Lashes',
          slug: 'eyebrows-lashes',
          description: 'Eyebrow shaping and lash extensions',
          display_order: 7,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Hair Removal',
          slug: 'hair-removal',
          description: 'Laser and other hair removal services',
          display_order: 8,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Barber',
          slug: 'barber',
          description: 'Men\'s haircuts and grooming',
          display_order: 9,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Spa Packages',
          slug: 'spa-packages',
          description: 'Combination spa treatments',
          display_order: 10,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          name: 'Other',
          slug: 'other',
          description: 'Other salon and spa services',
          display_order: 99,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('service_categories', categories, { transaction });

      // 2. Create sample services if none exist
      const existingServices = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM services',
        { type: queryInterface.sequelize.QueryTypes.SELECT, transaction }
      );

      if (parseInt(existingServices[0].count) === 0) {
        const hairCategory = await queryInterface.sequelize.query(
          'SELECT id FROM service_categories WHERE slug = ?',
          {
            replacements: ['hair'],
            type: queryInterface.sequelize.QueryTypes.SELECT,
            transaction
          }
        );

        const sampleServices = [
          {
            name: 'Women\'s Haircut',
            description: 'Professional haircut for women',
            price: 45.00,
            duration: 60,
            category_id: hairCategory[0].id,
            is_active: true,
            display_order: 1,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'Men\'s Haircut',
            description: 'Professional haircut for men',
            price: 30.00,
            duration: 30,
            category_id: hairCategory[0].id,
            is_active: true,
            display_order: 2,
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            name: 'Hair Coloring',
            description: 'Full hair coloring service',
            price: 80.00,
            duration: 120,
            category_id: hairCategory[0].id,
            is_active: true,
            display_order: 3,
            created_at: new Date(),
            updated_at: new Date()
          }
        ];

        await queryInterface.bulkInsert('services', sampleServices, { transaction });
      }

      // 3. Create default working hours for staff
      const staffMembers = await queryInterface.sequelize.query(
        'SELECT id FROM users WHERE role = ?',
        {
          replacements: ['staff'],
          type: queryInterface.sequelize.QueryTypes.SELECT,
          transaction
        }
      );

      const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      const workingHours = [];

      for (const staff of staffMembers) {
        for (const day of daysOfWeek) {
          workingHours.push({
            staff_id: staff.id,
            day_of_week: day,
            is_working: true,
            start_time: '09:00:00',
            end_time: '17:00:00',
            break_start_time: '12:00:00',
            break_end_time: '13:00:00',
            is_default: true,
            created_at: new Date(),
            updated_at: new Date()
          });
        }
      }

      await queryInterface.bulkInsert('working_hours', workingHours, { transaction });

      await transaction.commit();
      console.log('✅ Initial data seeded successfully');
    } catch (error) {
      await transaction.rollback();
      console.error('❌ Error seeding initial data:', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    // Remove all seed data
    await queryInterface.bulkDelete('working_hours', null, {});
    await queryInterface.bulkDelete('staff_services', null, {});
    await queryInterface.bulkDelete('services', null, {});
    await queryInterface.bulkDelete('service_categories', null, {});
  }
};
